import { createCrudController } from "@/features/crud/crud.controller"

import { useApiUrl } from "@/utilities/api.utility"

import type { CalendarDto } from "@/features/calendar/calendar.dto"

export function useCalendarController() {
  const apiUrl = useApiUrl()
  return createCrudController<CalendarDto>(`${apiUrl}/api/v1/calendars`)
}
