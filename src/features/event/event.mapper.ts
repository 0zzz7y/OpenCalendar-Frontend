import type { Event } from "@/features/event/event.model"
import type { EventDto } from "@/features/event/event.dto"
import { RecurringPattern } from "@/features/event/recurringPattern.type"
import type { Calendar } from "@/features/calendar/calendar.model"
import type { Category } from "@/features/category/category.model"

export function dtoToEvent(dto: EventDto, calendars: Calendar[], categories: Category[]): Event {
  return {
    id: dto.id || "",
    name: dto.name || "",
    description: dto.description || "",
    startDate: dto.startDate || "",
    endDate: dto.endDate || "",
    recurringPattern: dto.recurringPattern || RecurringPattern.NONE,
    calendar: calendars.find((c) => c.id === dto.calendarId) as Calendar,
    category: categories.find((c) => c.id === dto.categoryId) as Category
  }
}

export function eventToDto(event: Partial<Event>): EventDto {
  return {
    id: event.id || "",
    name: event.name || "",
    description: event.description,
    startDate: event.startDate || "",
    endDate: event.endDate || "",
    recurringPattern: event.recurringPattern || RecurringPattern.NONE,
    calendarId: event.calendar?.id || "",
    categoryId: event.category?.id || ""
  }
}
