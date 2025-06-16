import { createCrudRepository } from "@/features/crud/crud.repository"

import type { Calendar } from "@/features/calendar/calendar.model"

export function useCalendarRepository() {
  return createCrudRepository<Calendar>("calendars")
}
