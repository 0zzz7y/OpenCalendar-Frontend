import type Task from "@/model/domain/task"
import axios from "axios"

const base = `${import.meta.env.VITE_BASE_URL}/tasks`

export const getTasks = async (): Promise<Task[]> => {
  const result = await axios.get(base)
  return result.data ?? []
}

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const result = await axios.post(base, task)
  return result.data
}

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const result = await axios.put(`${base}/${id}`, updates)
  return result.data
}

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${base}/${id}`)
}
