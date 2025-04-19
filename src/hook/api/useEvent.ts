import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

import Event from "@/type/domain/event"

const useEvent = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const fetchEvents = async (pageNumber = 0, reset = false) => {
    try {
      const response = await axios.get<PaginatedResponse<Event>>(
        `${import.meta.env.VITE_BACKEND_URL}/events`,
        {
          params: {
            page: pageNumber,
            size
          }
        }
      )
      const data = response.data

      setEvents((prev) => (reset ? data.content : [...prev, ...data.content]))
      setPage(data.number)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch (error) {
      toast.error("Failed to fetch events")
    }
  }

  const reloadEvents = async () => {
    try {
      let allEvents: Event[] = []
      let currentPage = 0
      let total = 1

      do {
        const response = await axios.get<PaginatedResponse<Event>>(
          `${import.meta.env.VITE_BACKEND_URL}/events`,
          {
            params: {
              page: currentPage,
              size
            }
          }
        )
        const data = response.data

        allEvents = [...allEvents, ...data.content]
        total = data.totalPages
        currentPage++
      } while (currentPage < total)

      setEvents(allEvents)
      setPage(0)
      setTotalPages(1)
      setTotalElements(allEvents.length)
    } catch (error) {
      toast.error("Failed to reload all events")
    }
  }

  const loadNextPage = async () => {
    if (page + 1 >= totalPages) return
    setIsLoadingMore(true)
    await fetchEvents(page + 1)
    setIsLoadingMore(false)
  }

  const addEvent = async (event: Omit<Event, "id">): Promise<Event> => {
    if (!event.name.trim()) throw new Error("Event name cannot be empty.")

    const tempId = crypto.randomUUID()
    const optimisticEvent: Event = { ...event, id: tempId }

    setEvents((prev) => [...prev, optimisticEvent])

    try {
      const response = await axios.post<Event>(
        `${import.meta.env.VITE_BACKEND_URL}/events`,
        event
      )
      const savedEvent = response.data

      setEvents((prev) =>
        prev.map((e) => (e.id === tempId ? { ...savedEvent } : e))
      )
      return savedEvent
    } catch (error) {
      toast.error("Failed to add event")
      setEvents((prev) => prev.filter((e) => e.id !== tempId))
      throw error
    }
  }

  const updateEvent = async (id: string, updated: Partial<Event>) => {
    const previous = events.find((e) => e.id === id)
    if (!previous) return

    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    )

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/events/${id}`,
        updated
      )
    } catch (error) {
      toast.error("Failed to update event")
      setEvents((prev) => prev.map((e) => (e.id === id ? previous : e)))
      throw error
    }
  }

  const deleteEvent = async (id: string) => {
    const deleted = events.find((e) => e.id === id)
    if (!deleted) return

    setEvents((prev) => prev.filter((e) => e.id !== id))

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/events/${id}`)
    } catch (error) {
      toast.error("Failed to delete event")
      setEvents((prev) => [...prev, deleted])
      throw error
    }
  }

  useEffect(() => {
    reloadEvents()
  }, [])

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    reloadEvents,
    loadNextPage,
    page,
    size,
    totalPages,
    totalElements,
    isLoadingMore
  }
}

export default useEvent
