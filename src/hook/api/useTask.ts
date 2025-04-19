import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

import Task from "@/type/domain/task"

const useTask = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const fetchTasks = async (pageNumber = 0, reset = false) => {
    try {
      const response = await axios.get<PaginatedResponse<Task>>(
        `${import.meta.env.VITE_BACKEND_URL}/tasks`,
        { params: { page: pageNumber, size } }
      )
      const data = response.data

      setTasks((prev) => (reset ? data.content : [...prev, ...data.content]))
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
        const response = await axios.get<PaginatedResponse<Task>>(
          `${import.meta.env.VITE_BACKEND_URL}/tasks`,
          {
            params: {
              page: currentPage,
              size
            }
          }
        )

        const data = response.data
        allTasks = [...allTasks, ...data.content]
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

    const temporaryId = crypto.randomUUID()
    const optimisticTask: Task = { ...task, id: temporaryId }

    setTasks((prev) => [...prev, optimisticTask])

    try {
      const response = await axios.post<Task>(
        `${import.meta.env.VITE_BACKEND_URL}/tasks`,
        task
      )
      const savedTask = response.data

      setTasks((prev) =>prev.map((t) => (t.id === temporaryId ? { ...savedTask } : t)))
      return savedTask
    } catch (error) {
      toast.error("Failed to add task")
      setTasks((prev) => prev.filter((t) => t.id !== temporaryId))
      throw error
    }
  }

  const updateTask = async (id: string, updated: Partial<Task>) => {
    const previous = tasks.find((t) => t.id === id)
    if (!previous) return

    setTasks((prev) =>prev.map((t) => (t.id === id ? { ...t, ...updated } : t)))

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/tasks/${id}`,
        updated
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
  }, [])

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
