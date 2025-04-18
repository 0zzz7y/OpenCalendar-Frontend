import { useEffect, useState } from "react"
import { toast } from "react-toastify"

import useEvents from "./useEvents"
import { useTasks } from "./useTasks"
import { useNotes } from "./useNotes"
import { useCalendars } from "./useCalendars"
import { useCategories } from "./useCategories"

const useDashboard = () => {
  const { events, setEvents, fetchEvents } = useEvents()
  const { tasks, setTasks, fetchTasks } = useTasks()
  const { notes, setNotes, fetchNotes } = useNotes()
  const { calendars, setCalendars, fetchCalendars } = useCalendars()
  const { categories, setCategories, fetchCategories } = useCategories()

  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    try {
      setLoading(true)
      await Promise.all([
        fetchEvents().catch(() => toast.error("Failed to load events")),
        fetchTasks().catch(() => toast.error("Failed to load tasks")),
        fetchNotes().catch(() => toast.error("Failed to load notes")),
        fetchCalendars().catch(() => toast.error("Failed to load calendars")),
        fetchCategories().catch(() => toast.error("Failed to load categories"))
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return {
    events: events ?? [],
    setEvents: setEvents ?? [],
    tasks: tasks ?? [],
    setTasks: setTasks ?? [],
    notes: notes ?? [],
    setNotes: setNotes ?? [],
    calendars: calendars ?? [],
    setCalendars: setCalendars ?? [],
    categories: categories ?? [],
    setCategories: setCategories ?? [],
    loading: loading ?? false,
    refetch: fetchAll
  }
}

export default useDashboard
