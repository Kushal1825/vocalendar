// ─────────────────────────────────────────
// CalendarDay
// Single day cell in the month grid
// Shows date number + task pills
// Highlights today and selected day
// ─────────────────────────────────────────
const PRIORITY_COLORS = {
  high: "bg-red-500 text-white",
  medium: "bg-blue-500 text-white",
  low: "bg-green-500 text-white",
};

export default function CalendarDay({
  date,
  tasks,
  isCurrentMonth,
  isToday,
  isSelected,
  onClick,
}) {
  const dayNumber = date.getDate();
  const visibleTasks = tasks.slice(0, 2);
  const remainingCount = tasks.length - visibleTasks.length;

  return (
    <div
      onClick={onClick}
      className={`
        min-h-16 md:min-h-24 p-1 md:p-2 border-b border-r border-gray-100
        cursor-pointer transition-all flex flex-col gap-0.5
        ${isCurrentMonth ? "bg-white hover:bg-blue-50" : "bg-gray-50"}
        ${isSelected ? "bg-blue-50 ring-2 ring-inset ring-blue-500" : ""}
      `}
    >
      {/* day number */}
      <span
        className={`
          text-xs md:text-sm font-semibold w-6 h-6 md:w-7 md:h-7
          flex items-center justify-center rounded-full
          ${isToday ? "bg-blue-600 text-white" : ""}
          ${!isToday && isCurrentMonth ? "text-gray-900" : "text-gray-300"}
        `}
      >
        {dayNumber}
      </span>

      {/* task pills — hidden on very small screens */}
      <div className="hidden sm:flex flex-col gap-0.5">
        {visibleTasks.map((task) => (
          <div
            key={task.id}
            className={`text-xs px-1.5 py-0.5 rounded truncate font-medium ${
              PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium
            }`}
          >
            {task.task_name}
          </div>
        ))}
        {remainingCount > 0 && (
          <span className="text-xs text-gray-400 px-1">+{remainingCount}</span>
        )}
      </div>

      {/* dot indicator on mobile when task pills hidden */}
      {tasks.length > 0 && (
        <div className="flex sm:hidden justify-center mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        </div>
      )}
    </div>
  );
}