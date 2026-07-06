// ─────────────────────────────────────────
// Task service
// CRUD operations for user's saved tasks
// stored in Supabase via backend
// ─────────────────────────────────────────

import api from "./api";

// fetch all tasks for current user
export const getTasks = async () => {
  const res = await api.get("/tasks");
  return res.data.tasks;
};

// update an existing task
export const updateTask = async (taskId, updates) => {
  const res = await api.put(`/tasks/${taskId}`, updates);
  return res.data;
};

// delete a task
export const deleteTask = async (taskId) => {
  const res = await api.delete(`/tasks/${taskId}`);
  return res.data;
};