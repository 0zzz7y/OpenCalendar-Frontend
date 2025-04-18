import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Task from "../types/task";

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>(`${import.meta.env.VITE_BACKEND_URL}/tasks`);
      console.log("Tasks fetched:", response.data);
      setTasks(response.data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    }
  };

  const addTask = async (task: Omit<Task, "id">) => {
    try {
      const response = await axios.post<Task>(`${import.meta.env.VITE_BACKEND_URL}/tasks`, task);
      console.log("Task added:", response.data);
      setTasks((prev) => [...prev, response.data]);
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  const updateTask = async (id: string, updated: Partial<Task>) => {
    try {
      const response = await axios.put<Task>(`${import.meta.env.VITE_BACKEND_URL}/tasks/${id}`, updated);
      console.log("Task updated:", response.data);
      setTasks((prev) => prev.map((t) => (t.id === id ? response.data : t)));
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/tasks/${id}`);
      console.log("Task deleted:", id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  return {
    tasks,
    setTasks,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask
  };
};

export default useTasks;
