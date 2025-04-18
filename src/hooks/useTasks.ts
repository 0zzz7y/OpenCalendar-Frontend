import { useState, useCallback, useEffect } from "react";
import axios from "axios";

import Task from "../types/task";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get<Task[]>("/tasks");
      setTasks(response.data ?? []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    setTasks,
    fetchTasks
  };
};

export default useTasks;
