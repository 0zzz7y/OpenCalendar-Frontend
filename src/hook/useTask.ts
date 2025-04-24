import { useCallback } from "react"
import { getTasks, createTask, updateTask as serviceUpdate, deleteTask as serviceDelete } from "@/service/task.service"
import useAppStore from "@/store/useAppStore"
import { taskToDto, dtoToTask } from "@/model/mapper/task.mapper"
import type Task from "@/model/domain/task"

const useTask = () => {
  const { tasks, setTasks, calendars, categories } = useAppStore()

  const calendarMap = new Map(calendars.map(c => [c.id, c]))
  const categoryMap = new Map(categories.map(c => [c.id, c]))

  const reloadTasks = useCallback(async () => {
    const data = await getTasks()
    setTasks(data)
  }, [calendars, categories, setTasks])

  const addTask = useCallback(async (task: Partial<Task>) => {
    const dto = taskToDto(task)
    const created = await createTask(dto)
    const domain = dtoToTask(created, calendars, categories)
    setTasks([...tasks, domain])
    return domain
  }, [tasks, calendarMap, categoryMap, setTasks])

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const dto = taskToDto(updates)
    const updated = await serviceUpdate(id, dto)
    const domain = dtoToTask(updated, calendars, categories)
    setTasks(tasks.map(t => t.id === id ? domain : t))
    return domain
  }, [tasks, calendarMap, categoryMap, setTasks])

  const deleteTask = useCallback(async (id: string) => {
    await serviceDelete(id)
    setTasks(tasks.filter(t => t.id !== id))
  }, [tasks, setTasks])

  return { reloadTasks, addTask, updateTask, deleteTask }
}

export default useTask
