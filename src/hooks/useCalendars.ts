import { useEffect, useState } from "react"
import axios from "../api/axios"
import { Calendar } from "../models/calendar"

export const useCalendars = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([])

  const fetchCalendars = async () => {
    const response = await axios.get<Calendar[]>("/calendars")
    setCalendars(response.data)
  }

  useEffect(() => {
    fetchCalendars()
  }, [])

  return { calendars, setCalendars, fetchCalendars }
}
