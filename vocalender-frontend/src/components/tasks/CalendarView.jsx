import { useState } from "react";
import MonthNav from "./MonthNav";
import CalendarDay from "./CalendarDay";
import TaskCard from "./TaskCard";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function CalendarView({ tasks, onDelete, onUpdate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const goToPrevMonth = (resetToToday = false) => {
    if (resetToToday === true) {
      setCurrentDate(new Date());
      setSelectedDate(new Date());
      return;
    }
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const buildCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, daysInPrevMonth - i), isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ date: new Date(year, month + 1, d), isCurrentMonth: false });
    }
    return days;
  };

  const getTasksForDate = (date) =>
    tasks.filter((task) => {
      if (!task.scheduled_at) return false;
      const t = new Date(task.scheduled_at);
      return (
        t.getFullYear() === date.getFullYear() &&
        t.getMonth() === date.getMonth() &&
        t.getDate() === date.getDate()
      );
    });

  const selectedTasks = getTasksForDate(selectedDate);
  const today = new Date();
  const calendarDays = buildCalendarDays();

  const isToday = (date) =>
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const isSelected = (date) =>
    selectedDate &&
    date.getFullYear() === selectedDate.getFullYear() &&
    date.getMonth() === selectedDate.getMonth() &&
    date.getDate() === selectedDate.getDate();

  return (
    // ── stack vertically on mobile, side by side on desktop ──
    <div className="flex flex-col lg:flex-row gap-4 items-start">

      {/* ── LEFT — calendar grid ── */}
      <div className="w-full lg:flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* month nav */}
        <div className="px-4 py-4 border-b border-gray-100">
          <MonthNav
            currentDate={currentDate}
            onPrev={goToPrevMonth}
            onNext={goToNextMonth}
          />
        </div>

        {/* weekday headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
          {WEEKDAYS.map((day, i) => (
            <div key={i} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* day grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map(({ date, isCurrentMonth }, index) => (
            <CalendarDay
              key={index}
              date={date}
              tasks={getTasksForDate(date)}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday(date)}
              isSelected={isSelected(date)}
              onClick={() => setSelectedDate(date)}
            />
          ))}
        </div>
      </div>

      {/* ── RIGHT — selected day panel ── */}
      <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* panel header — clean blue, no gradient ── */}
        <div className="px-5 py-4 border-b border-blue-100 bg-blue-600">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
            Selected day
          </p>
          <p className="text-white font-bold text-base">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-blue-200 text-sm mt-0.5">
            {selectedTasks.length} task{selectedTasks.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* task list */}
        <div className="p-4 flex flex-col gap-3 max-h-96 overflow-y-auto">
          {selectedTasks.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <span className="text-4xl">🗓️</span>
              <p className="text-gray-500 text-sm font-medium">No tasks this day</p>
              <p className="text-gray-400 text-xs">Click the mic to add one</p>
            </div>
          ) : (
            selectedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}