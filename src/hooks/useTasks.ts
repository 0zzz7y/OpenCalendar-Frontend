import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Task } from "../types/task";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const response = await axios.get<Task[]>("/tasks");
    setTasks(response.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, setTasks, fetchTasks };
};
