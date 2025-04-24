import { useCallback } from "react"
import {
  getCalendars,
  createCalendar,
  updateCalendar as serviceUpdate,
  deleteCalendar as serviceDelete
} from "@/service/calendar.service"
import useAppStore from "@/store/useAppStore"
import type Calendar from "@/model/domain/calendar"

const useCalendar = () => {
  const { calendars, setCalendars } = useAppStore()

  const reloadCalendars = useCallback(async () => {
    const data = await getCalendars()
    setCalendars(data)
  }, [setCalendars])

  const addCalendar = useCallback(async (calendar: Partial<Calendar>) => {
    const created = await createCalendar(calendar as Calendar)
    setCalendars([...calendars, created])
    return created
  }, [calendars, setCalendars])

  const updateCalendar = useCallback(async (id: string, updates: Partial<Calendar>) => {
    const updated = await serviceUpdate(id, updates)
    setCalendars(calendars.map((c) => (c.id === id ? updated : c)))
    return updated
  }, [calendars, setCalendars])

  const deleteCalendar = useCallback(async (id: string) => {
    await serviceDelete(id)
    setCalendars(calendars.filter((c) => c.id !== id))
  }, [calendars, setCalendars])

  return {
    reloadCalendars,
    addCalendar,
    updateCalendar,
    deleteCalendar
  }
}

export default useCalendar
