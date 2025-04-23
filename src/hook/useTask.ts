// hook/useTask.ts
import { useCallback } from "react"
import { getTasks, createTask, updateTask, deleteTask } from "@/service/task.service"
import useAppStore from "@/store/useAppStore"
import type Task from "@/model/domain/task"

const useTask = () => {
  const setTasks = useAppStore((state: { setTasks: (tasks: Task[]) => void }) => state.setTasks)

  const reloadTasks = useCallback(async () => {
    const data = await getTasks()
    setTasks(data)
  }, [setTasks])

  const addTask = useCallback(async (task: Partial<Task>) => {
    return await createTask(task)
  }, [])

  const updateTaskById = useCallback(async (id: string, updates: Partial<Task>) => {
    return await updateTask(id, updates)
  }, [])

  const deleteTaskById = useCallback(async (id: string) => {
    return await deleteTask(id)
  }, [])

  return {
    reloadTasks,
    addTask,
    updateTask: updateTaskById,
    deleteTask: deleteTaskById
  }
}

export default useTask
