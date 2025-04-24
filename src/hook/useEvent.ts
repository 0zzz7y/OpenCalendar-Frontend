import { useCallback } from "react"
import {
  getEvents,
  createEvent,
  updateEvent as serviceUpdate,
  deleteEvent as serviceDelete
} from "@/service/event.service"
import useAppStore from "@/store/useAppStore"
import type Event from "@/model/domain/event"

const useEvent = () => {
  const { events, setEvents } = useAppStore()

  const reloadEvents = useCallback(async () => {
    const data = await getEvents()
    setEvents(data)
  }, [setEvents])

  const addEvent = useCallback(async (event: Partial<Event>) => {
    const created = await createEvent(event)
    setEvents([...events, created])
    return created
  }, [events, setEvents])

  const updateEvent = useCallback(async (id: string, updates: Partial<Event>) => {
    const updated = await serviceUpdate(id, updates)
    setEvents(events.map((e) => (e.id === id ? updated : e)))
    return updated
  }, [events, setEvents])

  const deleteEvent = useCallback(async (id: string) => {
    await serviceDelete(id)
    setEvents(events.filter((e) => e.id !== id))
  }, [events, setEvents])

  return {
    reloadEvents,
    addEvent,
    updateEvent,
    deleteEvent
  }
}

export default useEvent
