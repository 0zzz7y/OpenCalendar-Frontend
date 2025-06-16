import { createCrudService } from "@/features/crud/crud.service"

import { useCalendarController } from "@/features/calendar/calendar.controller"
import { useCalendarRepository } from "@/features/calendar/calendar.repository"
import { calendarToDto, dtoToCalendar } from "@/features/calendar/calendar.mapper"
import { validateCalendar } from "@/features/calendar/calendar.validation"

import type { Calendar } from "@/features/calendar/calendar.model"
import type { CalendarDto } from "@/features/calendar/calendar.dto"

export function useCalendarService() {
  const controller = useCalendarController()
  const repository = useCalendarRepository()

  return createCrudService<Calendar, CalendarDto, CalendarDto>(
    controller,
    repository,
    calendarToDto,
    dtoToCalendar,
    validateCalendar
  )
}
