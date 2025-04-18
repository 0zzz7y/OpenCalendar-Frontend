import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Task from "../types/task";

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchTasks = async (pageNumber = 0, reset = false) => {
    try {
      const response = await axios.get<PaginatedResponse<Task>>(
        `${import.meta.env.VITE_BACKEND_URL}/tasks`,
        { params: { page: pageNumber, size } }
      );

      const data = response.data;

      setTasks((prev) => reset ? data.content : [...prev, ...data.content]);
      setPage(data.number);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    }
  };

  const reloadTasks = async () => {
    try {
      let allTasks: Task[] = [];
      let currentPage = 0;
      let total = 1;

      do {
        const response = await axios.get<PaginatedResponse<Task>>(
          `${import.meta.env.VITE_BACKEND_URL}/tasks`,
          { params: { page: currentPage, size } }
        );

        const data = response.data;
        allTasks = [...allTasks, ...data.content];
        total = data.totalPages;
        currentPage++;
      } while (currentPage < total);

      setTasks(allTasks);
      setPage(0);
      setTotalPages(1);
      setTotalElements(allTasks.length);
    } catch (error) {
      toast.error("Failed to reload all tasks");
    }
  };

  const loadNextPage = async () => {
    if (page + 1 >= totalPages) return;
    setIsLoadingMore(true);
    await fetchTasks(page + 1);
    setIsLoadingMore(false);
  };

  const addTask = async (task: Omit<Task, "id">) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/tasks`, task);
      await reloadTasks();
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  const updateTask = async (id: string, updated: Partial<Task>) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/tasks/${id}`, updated);
      await reloadTasks();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/tasks/${id}`);
      await reloadTasks();
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  useEffect(() => {
    reloadTasks();
  }, []);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    reloadTasks,
    loadNextPage,
    page,
    size,
    totalPages,
    totalElements,
    isLoadingMore
  };
};

export default useTasks;
