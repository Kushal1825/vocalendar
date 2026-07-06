import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";
import { isPastDate } from "../../utils/formatDate";

export default function TaskList({ tasks, filter, onDelete, onUpdate }) {
  const filteredTasks = tasks.filter((task) => {
    if (filter === "upcoming") return !isPastDate(task.scheduled_at);
    if (filter === "completed") return isPastDate(task.scheduled_at);
    return true;
  });

  if (filteredTasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}