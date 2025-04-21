import AppContext from "@/context/AppContext"
import PaginatedResponse from "@/type/communication/paginatedResponse"
import Calendar from "@/type/domain/calendar"
import Category from "@/type/domain/category"
import RecurringPattern from "@/type/domain/recurringPattern"
import Task from "@/type/domain/task"
import TaskStatus from "@/type/domain/taskStatus"
import TaskDto from "@/type/dto/taskDto"
import { toTask, toTaskDto } from "@/type/mapper/taskMapper"

import { useEffect, useState, useContext } from "react"

import axios from "axios"
import { toast } from "react-toastify"

const useTask = () => {
  const { calendars = [], categories = [] } = useContext(AppContext) || {}

  const [tasks, setTasks] = useState<Task[]>([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const fetchTasks = async (pageNumber = 0, reset = false) => {
    try {
      const response = await axios.get<PaginatedResponse<TaskDto>>(
        `${import.meta.env.VITE_BACKEND_URL}/tasks`,
        {
          params: {
            page: pageNumber,
            size
          }
        }
      )
      const data = response.data
      const mappedTasks = data.content.map((taskDto) => {
        const calendar = calendars.find((cal) => cal.id === taskDto.calendarId)
        const category = categories.find((cat) => cat.id === taskDto.categoryId)
        if (!calendar || !category) {
          throw new Error(
            `Calendar or Category not found for task ${taskDto.id}`
          )
        }
        return toTask(taskDto, calendar, category)
      })

      setTasks((prev) => (reset ? mappedTasks : [...prev, ...mappedTasks]))
      setPage(data.number)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch (error) {
      toast.error("Failed to fetch tasks")
    }
  }

  const reloadTasks = async () => {
    try {
      let allTasks: Task[] = []
      let currentPage = 0
      let total = 1

      do {
        const response = await axios.get<PaginatedResponse<TaskDto>>(
          `${import.meta.env.VITE_BACKEND_URL}/tasks`,
          {
            params: {
              page: currentPage,
              size
            }
          }
        )
        const data = response.data

        const mappedTasks = data.content.map((taskDto) => {
          const calendar = calendars.find(
            (cal) => cal.id === taskDto.calendarId
          )
          const category = categories.find(
            (cat) => cat.id === taskDto.categoryId
          )
          if (!calendar || !category) {
            throw new Error(
              `Calendar or Category not found for task ${taskDto.id}`
            )
          }
          return toTask(taskDto, calendar, category)
        })
        allTasks = [...allTasks, ...mappedTasks]
        total = data.totalPages
        currentPage++
      } while (currentPage < total)

      setTasks(allTasks)
      setPage(0)
      setTotalPages(1)
      setTotalElements(allTasks.length)
    } catch (error) {
      toast.error("Failed to reload all tasks")
    }
  }

  const loadNextPage = async () => {
    if (page + 1 >= totalPages) return
    setIsLoadingMore(true)
    await fetchTasks(page + 1)
    setIsLoadingMore(false)
  }

  const addTask = async (task: Omit<Task, "id">): Promise<Task> => {
    if (!task.name.trim()) throw new Error("Task name cannot be empty.")

    const tempId = crypto.randomUUID()
    const optimisticTask: Task = { ...task, id: tempId }

    setTasks((prev) => [...prev, optimisticTask])

    try {
      const response = await axios.post<TaskDto>(
        `${import.meta.env.VITE_BACKEND_URL}/tasks`,
        toTaskDto({ id: "", ...task })
      )
      const savedTask = toTask(response.data, task.calendar, task.category)

      setTasks((prev) =>
        prev.map((t) => (t.id === tempId ? { ...savedTask } : t))
      )
      return savedTask
    } catch (error) {
      toast.error("Failed to add task")
      setTasks((prev) => prev.filter((t) => t.id !== tempId))
      throw error
    }
  }

  const updateTask = async (id: string, updated: Partial<Task>) => {
    const previous = tasks.find((t) => t.id === id)
    if (!previous) return

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    )

    try {
      const updatedWithId = {
        id,
        name: updated.name ?? "",
        description: updated.description ?? "",
        startDate: updated.startDate,
        endDate: updated.endDate,
        recurringPattern: updated.recurringPattern ?? RecurringPattern.NONE,
        status: updated.status ?? TaskStatus.TODO,
        calendar: updated.calendar ?? previous.calendar,
        category: updated.category ?? previous.category
      }
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/tasks/${id}`,
        toTaskDto(updatedWithId)
      )
    } catch (error) {
      toast.error("Failed to update task")
      setTasks((prev) => prev.map((t) => (t.id === id ? previous : t)))
      throw error
    }
  }

  const deleteTask = async (id: string) => {
    const deleted = tasks.find((t) => t.id === id)
    if (!deleted) return

    setTasks((prev) => prev.filter((t) => t.id !== id))

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/tasks/${id}`)
    } catch (error) {
      toast.error("Failed to delete task")
      setTasks((prev) => [...prev, deleted])
      throw error
    }
  }

  useEffect(() => {
    reloadTasks()
  }, [reloadTasks])

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
  }
}

export default useTask
