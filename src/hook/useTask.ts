import { useCallback } from "react"
import { getTasks, createTask, updateTask as serviceUpdate, deleteTask as serviceDelete } from "@/service/task.service"
import useAppStore from "@/store/useAppStore"
import { toTaskDto, fromTaskDto } from "@/model/mapper/taskMapper"
import type Task from "@/model/domain/task"

const useTask = () => {
  const { setTasks, calendars, categories, tasks: currentTasks } = useAppStore()

  const calendarMap = new Map(calendars.map(c => [c.id, c]))
  const categoryMap = new Map(categories.map(c => [c.id, c]))

  const reloadTasks = useCallback(async () => {
    const dtos = await getTasks()
    const domainTasks = dtos.map(dto => fromTaskDto(dto, calendarMap, categoryMap))
    setTasks(domainTasks)
  }, [calendars, categories, setTasks])

  const addTask = useCallback(async (task: Partial<Task>) => {
    const dto = toTaskDto(task)
    const created = await createTask(dto)
    const domain = fromTaskDto(created, calendarMap, categoryMap)
    setTasks([...currentTasks, domain])
    return domain
  }, [currentTasks, calendarMap, categoryMap, setTasks])

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const dto = toTaskDto(updates)
    const updated = await serviceUpdate(id, dto)
    const domain = fromTaskDto(updated, calendarMap, categoryMap)
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
