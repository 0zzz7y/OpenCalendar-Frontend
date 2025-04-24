import { useCallback } from "react"
import {
  getTasks,
  createTask,
  updateTask as serviceUpdateTask,
  deleteTask as serviceDeleteTask
} from "@/service/task.service"
import useAppStore from "@/store/useAppStore"
import type Task from "@/model/domain/task"

const useTask = () => {
  const setTasks = useAppStore((state) => state.setTasks)

  const reloadTasks = useCallback(async () => {
    const data = await getTasks()
    setTasks(data)
  }, [setTasks])

  const addTask = useCallback(async (task: Partial<Task>) => {
    const created = await createTask(task)
    setTasks((prev: Task[]) => [...prev, created])
    return created
  }, [setTasks])

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const updated = await serviceUpdateTask(id, updates)
    setTasks((prev: Task[]) => prev.map((t) => (t.id === id ? updated : t)))
    return updated
  }, [setTasks])

  const deleteTask = useCallback(async (id: string) => {
    await serviceDeleteTask(id)
    setTasks((prev: Task[]) => prev.filter((t) => t.id !== id))
  }, [setTasks])

  return {
    reloadTasks,
    addTask,
    updateTask,
    deleteTask
  }
}

export default useTask
