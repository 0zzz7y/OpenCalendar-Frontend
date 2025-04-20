import { useState, useEffect } from "react"

import axios from "axios"

import { toast } from "react-toastify"

import Calendar from "@/type/domain/calendar"
import PaginatedResponse from "@/type/communication/paginatedResponse"

const useCalendar = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const fetchCalendars = async (pageNumber = 0, reset = false) => {
    try {
      const response = await axios.get<PaginatedResponse<Calendar>>(
        `${import.meta.env.VITE_BACKEND_URL}/calendars`,
        {
          params: {
            page: pageNumber,
            size
          }
        }
      )
      const data = response.data

      setCalendars((prev) =>
        reset ? data.content : [...prev, ...data.content]
      )
      setPage(data.number)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch (error) {
      toast.error("Failed to fetch calendars")
    }
  }

  const reloadCalendars = async () => {
    try {
      let allCalendars: Calendar[] = []
      let currentPage = 0
      let total = 1

      do {
        const response = await axios.get<PaginatedResponse<Calendar>>(
          `${import.meta.env.VITE_BACKEND_URL}/calendars`,
          {
            params: {
              page: currentPage,
              size
            }
          }
        )
        const data = response.data

        allCalendars = [...allCalendars, ...data.content]
        total = data.totalPages
        currentPage++
      } while (currentPage < total)

      setCalendars(allCalendars)
      setPage(0)
      setTotalPages(1)
      setTotalElements(allCalendars.length)
    } catch (error) {
      toast.error("Failed to reload all calendars")
    }
  }

  const loadNextPage = async () => {
    if (page + 1 >= totalPages) return
    setIsLoadingMore(true)
    await fetchCalendars(page + 1)
    setIsLoadingMore(false)
  }

  const addCalendar = async (
    calendar: Omit<Calendar, "id">
  ): Promise<Calendar> => {
    if (!calendar.name.trim()) throw new Error("Calendar name cannot be empty.")

    const tempId = crypto.randomUUID()
    const optimisticCalendar = { ...calendar, id: tempId }

    setCalendars((prev) => [...prev, optimisticCalendar])

    try {
      const response = await axios.post<Calendar>(
        `${import.meta.env.VITE_BACKEND_URL}/calendars`,
        calendar
      )
      const savedCalendar = response.data

      setCalendars((prev) =>
        prev.map((c) => (c.id === tempId ? { ...savedCalendar } : c))
      )
      return savedCalendar
    } catch (error) {
      toast.error("Failed to add calendar")
      setCalendars((prev) => prev.filter((c) => c.id !== tempId))
      throw error
    }
  }

  const updateCalendar = async (id: string, updated: Partial<Calendar>) => {
    const previous = calendars.find((c) => c.id === id)
    if (!previous) return

    setCalendars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    )

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/calendars/${id}`,
        updated
      )
    } catch (error) {
      toast.error("Failed to update calendar")
      setCalendars((prev) => prev.map((c) => (c.id === id ? previous : c)))
      throw error
    }
  }

  const deleteCalendar = async (id: string) => {
    const deleted = calendars.find((c) => c.id === id)
    if (!deleted) return

    setCalendars((prev) => prev.filter((c) => c.id !== id))

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/calendars/${id}`)
    } catch (error) {
      toast.error("Failed to delete calendar")
      setCalendars((prev) => [...prev, deleted])
      throw error
    }
  }

  useEffect(() => {
    reloadCalendars()
  }, [])

  return {
    calendars,
    addCalendar,
    updateCalendar,
    deleteCalendar,
    reloadCalendars,
    loadNextPage,
    page,
    size,
    totalPages,
    totalElements,
    isLoadingMore
  }
}

export default useCalendar
