/**
 * Copyright (c) Tomasz Wnuk
 */

import type Event from "@/model/domain/event"
import type EventDto from "@/model/dto/event.dto"
import type Calendar from "@/model/domain/calendar"
import type Category from "@/model/domain/category"
import RecurringPattern from "../domain/recurringPattern"

export function dtoToEvent(dto: EventDto, calendars: Calendar[], categories: Category[]): Event {
  return {
    id: dto.id ?? "",
    title: dto.title,
    description: dto.description,
    startDate: dto.startDate,
    endDate: dto.endDate,
    recurringPattern: dto.recurringPattern,
    calendar: calendars.find((c) => c.id === dto.calendarId) as Calendar,
    category: categories.find((c) => c.id === dto.categoryId) as Category
  }
}

export function eventToDto(event: Partial<Event>): EventDto {
  return {
    id: event.id,
    title: event.title ?? "",
    description: event.description,
    startDate: event.startDate ?? "",
    endDate: event.endDate ?? "",
    recurringPattern: event.recurringPattern ?? RecurringPattern.NONE,
    calendarId: event.calendar?.id ?? "",
    categoryId: event.category?.id
  }
}
