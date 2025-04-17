import { useEffect, useState } from "react"
import axios from "../api/axios"
import { Event } from "../types/event"

const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([])

  const fetchEvents = async () => {
    const response = await axios.get<Event[]>("/events")
    setEvents(response.data)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return { events, setEvents, fetchEvents }
}

export default useEvents
