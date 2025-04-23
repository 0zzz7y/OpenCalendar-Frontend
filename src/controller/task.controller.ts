import useAppStore from "@/store/useAppStore"
import * as taskService from "@/service/task.service"
import type Task from "@/model/domain/task"

export const loadTasks = async () => {
  const tasks = await taskService.getTasks()
  useAppStore.getState().setTasks(tasks)
}

export const addTask = async (task: Partial<Task>) => {
  const created = await taskService.createTask(task)
  useAppStore.getState().setTasks([...useAppStore.getState().tasks, created])
}

export const updateTask = async (task: Task) => {
  const updated = await taskService.updateTask(task.id, task)
  useAppStore.getState().setTasks(
    useAppStore.getState().tasks.map((t) => (t.id === updated.id ? updated : t))
  )
}

export const deleteTask = async (id: string) => {
  await taskService.deleteTask(id)
  useAppStore.getState().setTasks(
    useAppStore.getState().tasks.filter((t) => t.id !== id)
  )
}
