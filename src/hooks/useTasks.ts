import { useEffect, useState } from "react"
import axios from "../api/axios"
import Task from "../types/task"

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>("/tasks")
      setTasks(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return { tasks, setTasks, fetchTasks }
}
