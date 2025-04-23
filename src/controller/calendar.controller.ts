import useAppStore from "@/store/useAppStore"
import * as calendarService from "@/service/calendar.service"
import type Calendar from "@/model/domain/calendar"

export const loadCalendars = async () => {
  const calendars = await calendarService.getCalendars()
  useAppStore.getState().setCalendars(calendars)
}

export const addCalendar = async (calendar: { name: string; emoji?: string }) => {
  const created = await calendarService.createCalendar(calendar)
  useAppStore.getState().setCalendars([...useAppStore.getState().calendars, created])
}

export const updateCalendar = async (calendar: Calendar) => {
  const updated = await calendarService.updateCalendar(calendar.id, calendar)
  useAppStore.getState().setCalendars(
    useAppStore.getState().calendars.map((c) => (c.id === updated.id ? updated : c))
  )
}

export const deleteCalendar = async (id: string) => {
  await calendarService.deleteCalendar(id)
  useAppStore.getState().setCalendars(
    useAppStore.getState().calendars.filter((c) => c.id !== id)
  )
}
