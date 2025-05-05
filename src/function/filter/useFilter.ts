/**
 * Copyright (c) Tomasz Wnuk
 */

import type Task from "@/model/domain/task"
import type Event from "@/model/domain/event"
import type Note from "@/model/domain/note"

import FILTER from "@/constant/utility/filter"

export function isCategoryUsed(categoryId: string, tasks: Task[], events: Event[], notes: Note[]): boolean {
  if (categoryId === FILTER.ALL) return true

  return (
    tasks.some((task) => task.category?.id === categoryId) ||
    events.some((event) => event.category?.id === categoryId) ||
    notes.some((note) => note.category?.id === categoryId)
  )
}

export function isCalendarUsed(calendarId: string, tasks: Task[], events: Event[], notes: Note[]): boolean {
  if (calendarId === FILTER.ALL) return true

  return (
    tasks.some((task) => task.calendar?.id === calendarId) ||
    events.some((event) => event.calendar?.id === calendarId) ||
    notes.some((note) => note.calendar?.id === calendarId)
  )
}
