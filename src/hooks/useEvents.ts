import { useEffect, useState } from "react"
import axios from "../api/axios"
import Event from "../types/event"

const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([])

  const fetchEvents = async () => {
    try {
      const response = await axios.get<Event[]>("/events")
      setEvents(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error("Failed to fetch events:", error)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return { events, setEvents, fetchEvents }
}

export default useEvents
