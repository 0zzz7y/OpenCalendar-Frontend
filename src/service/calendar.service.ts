import type CalendarDto from "@/model/dto/calendar.dto"
import { createCrudService } from "./crud.service"

export const {
  getAll: getCalendars,
  create: createCalendar,
  update: updateCalendar,
  delete: deleteCalendar
} = createCrudService<CalendarDto>(`${import.meta.env.VITE_API_URL}/calendars`)
