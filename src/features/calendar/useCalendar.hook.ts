import { useCalendarService } from "@/features/calendar/calendar.service"

export function useCalendar() {
  const { reload, add, update, remove } = useCalendarService()

  return {
    reloadCalendars: reload,
    addCalendar: add,
    updateCalendar: update,
    deleteCalendar: remove
  }
}
