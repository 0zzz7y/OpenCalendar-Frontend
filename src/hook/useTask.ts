import { useCallback } from "react"
import { getTasks, createTask, updateTask as serviceUpdate, deleteTask as serviceDelete } from "@/service/task.service"
import useAppStore from "@/store/useAppStore"
import { taskToDto, dtoToTask } from "@/model/mapper/task.mapper"
import type Task from "@/model/domain/task"

const useTask = () => {
  const { setTasks, calendars, categories, tasks: currentTasks } = useAppStore()

  const calendarMap = new Map(calendars.map(c => [c.id, c]))
  const categoryMap = new Map(categories.map(c => [c.id, c]))

  const reloadTasks = useCallback(async () => {
    const data = await getTasks()
    setTasks(data)
  }, [calendars, categories, setTasks])

  const addTask = useCallback(async (task: Partial<Task>) => {
    const dto = taskToDto(task)
    const created = await createTask(dto)
    const domain = dtoToTask(created, calendarMap, categoryMap)
    setTasks([...currentTasks, domain])
    return domain
  }, [currentTasks, calendarMap, categoryMap, setTasks])

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const dto = taskToDto(updates)
    const updated = await serviceUpdate(id, dto)
    const domain = dtoToTask(updated, calendarMap, categoryMap)
    setTasks(currentTasks.map(t => t.id === id ? domain : t))
    return domain
  }, [currentTasks, calendarMap, categoryMap, setTasks])

  const deleteTask = useCallback(async (id: string) => {
    await serviceDelete(id)
    setTasks(currentTasks.filter(t => t.id !== id))
  }, [currentTasks, setTasks])

  return { reloadTasks, addTask, updateTask, deleteTask }
}

export default useTask
