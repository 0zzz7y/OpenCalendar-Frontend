import type CalendarDto from "@/model/dto/calendar.dto"
import { createCrudService } from "./crud.service"

const serviceUrl = import.meta.env.VITE_API_URL || "http://localhost:8080"

export const {
  getAll: getCalendars,
  create: createCalendar,
  update: updateCalendar,
  delete: deleteCalendar
} = createCrudService<CalendarDto>(`${serviceUrl}/api/v1/calendars`)
