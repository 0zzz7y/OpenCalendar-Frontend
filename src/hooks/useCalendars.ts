import { useEffect, useState } from "react"
import axios from "../api/axios"
import Calendar from "../types/calendar"

export const useCalendars = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([])

  const fetchCalendars = async () => {
    try {
      const response = await axios.get<Calendar[]>("/calendars")
      setCalendars(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error("Failed to fetch calendars:", error)
    }
  }

  useEffect(() => {
    fetchCalendars()
  }, [])

  return { calendars, setCalendars, fetchCalendars }
}
