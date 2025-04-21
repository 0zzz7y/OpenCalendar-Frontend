import EventDto from "../dto/eventDto"
import Event from "../domain/event"
import Calendar from "../domain/calendar"
import Category from "../domain/category"
import RecurringPattern from "../domain/recurringPattern"

export const toEvent = (
  dto: EventDto,
  calendar: Calendar,
  category?: Category
): Event => ({
  id: dto.id ?? "",
  name: dto.name,
  description: dto.description,
  startDate: dto.startDate,
  endDate: dto.endDate,
  recurringPattern: dto.recurringPattern as RecurringPattern,
  calendar,
  category
})

export const toEventDto = (event: Event): EventDto => ({
  id: event.id,
  name: event.name,
  description: event.description,
  startDate: event.startDate,
  endDate: event.endDate,
  recurringPattern: event.recurringPattern,
  calendarId: event.calendar.id,
  categoryId: event.category?.id
})
