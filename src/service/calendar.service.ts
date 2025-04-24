import type Calendar from "@/model/domain/calendar"
import axios from "axios"

const base = `${import.meta.env.VITE_BASE_URL}/calendars`

export const getCalendars = async (): Promise<Calendar[]> => {
  const result = await axios.get(base)
  return result.data
}

export const createCalendar = async (calendar: { name: string; emoji?: string }): Promise<Calendar> => {
  const result = await axios.post(base, calendar)
  return result.data
}

export const updateCalendar = async (id: string, updates: Partial<Calendar>): Promise<Calendar> => {
  const result = await axios.put(`${base}/${id}`, updates)
  return result.data
}

export const deleteCalendar = async (id: string): Promise<void> => {
  await axios.delete(`${base}/${id}`)
}
