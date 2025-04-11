import { useEffect, useState } from 'react';
import { Task } from '../types';

const URL = '/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch(URL);
      const data = await res.json();
      setTasks(data);
    } catch {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task: Omit<Task, 'id'>) => {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (res.ok) fetchTasks();
  };

  const updateTask = async (task: Task) => {
    const res = await fetch(`${URL}/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (res.ok) fetchTasks();
  };

  const deleteTask = async (id: string) => {
    const res = await fetch(`${URL}/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
}
