// hook/useEvent.ts
import { useCallback } from "react"
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/service/event.service"
import useAppStore from "@/store/useAppStore"
import type Event from "@/model/domain/event"

const useEvent = () => {
  const setEvents = useAppStore((state: { setEvents: (events: Event[]) => void }) => state.setEvents)

  const reloadEvents = useCallback(async () => {
    const data = await getEvents()
    setEvents(data)
  }, [setEvents])

  const addEvent = useCallback(async (event: Partial<Event>) => {
    return await createEvent(event)
  }, [])

  const updateEventById = useCallback(async (id: string, updates: Partial<Event>) => {
    return await updateEvent(id, updates)
  }, [])

  const deleteEventById = useCallback(async (id: string) => {
    return await deleteEvent(id)
  }, [])

  return {
    reloadEvents,
    addEvent,
    updateEvent: updateEventById,
    deleteEvent: deleteEventById
  }
}

export default useEvent
