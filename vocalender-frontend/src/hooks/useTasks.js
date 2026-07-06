// ─────────────────────────────────────────
// useTasks hook
// Manages task list state — fetch, update,
// delete. Used by TasksPage and TaskList
// ─────────────────────────────────────────

import { useState, useEffect } from "react";
import { getTasks, updateTask, deleteTask } from "../services/taskService";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── fetch tasks on mount ──
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── update a task ──
  const handleUpdate = async (taskId, updates) => {
    try {
      await updateTask(taskId, updates);
      // update local state without refetching
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
    } catch (err) {
      setError("Failed to update task.");
    }
  };

  // ── delete a task ──
  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      // remove from local state immediately
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError("Failed to delete task.");
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    handleUpdate,
    handleDelete,
  };
};