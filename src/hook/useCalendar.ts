// hook/useCalendar.ts
import { useCallback } from "react"
import { getCalendars, createCalendar, updateCalendar, deleteCalendar } from "@/service/calendar.service"
import useAppStore from "@/store/useAppStore"
import type Calendar from "@/model/domain/calendar"

const useCalendar = () => {
  const setCalendars = useAppStore((state: { setCalendars: (calendars: Calendar[]) => void }) => state.setCalendars)

  const reloadCalendars = useCallback(async () => {
    const data = await getCalendars()
    setCalendars(data)
  }, [setCalendars])

  const addCalendar = useCallback(async (calendar: { name: string; emoji?: string }) => {
    return await createCalendar(calendar)
  }, [])

  const updateCalendarById = useCallback(async (id: string, updates: Partial<Calendar>) => {
    return await updateCalendar(id, updates)
  }, [])

  const deleteCalendarById = useCallback(async (id: string) => {
    return await deleteCalendar(id)
  }, [])

  return {
    reloadCalendars,
    addCalendar,
    updateCalendar: updateCalendarById,
    deleteCalendar: deleteCalendarById
  }
}

export default useCalendar
