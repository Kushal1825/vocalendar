// src/components/ConfirmationCard.jsx

import { useState } from "react";

export default function ConfirmationCard({ data, onConfirm, onCancel }) {
  const [task, setTask] = useState(data?.title || "");
  const [date, setDate] = useState(data?.start_datetime?.split("T")[0] || "");
  const [time, setTime] = useState(data?.start_datetime?.split("T")[1]?.slice(0, 5) || "");
  const [priority, setPriority] = useState(data?.priority || "medium");
  const handleConfirm = () => {
    onConfirm({ task, date, time, priority });
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full flex flex-col gap-4">
      <h2 className="text-lg font-bold text-white">Confirm Task</h2>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Task</label>
        <input
          className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Date</label>
        <input
          type="date"
          className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Time</label>
        <input
          type="time"
          className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Priority</label>
        <select
          className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          onClick={handleConfirm}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 text-sm font-bold transition-all"
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-2 text-sm transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}