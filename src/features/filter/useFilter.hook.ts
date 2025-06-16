import type { Event } from "@/features/event/event.model"
import type { Task } from "@/features/task/task.model"
import type { Note } from "@/features/note/note.model"

import { Filter } from "@/features/filter/filter.type"

export function isCalendarUsed(calendarId: string, tasks: Task[], events: Event[], notes: Note[]): boolean {
  if (calendarId === Filter.ALL) return true

  return (
    tasks.some((task) => task.calendar?.id === calendarId) ||
    events.some((event) => event.calendar?.id === calendarId) ||
    notes.some((note) => note.calendar?.id === calendarId)
  )
}

export function isCategoryUsed(categoryId: string, tasks: Task[], events: Event[], notes: Note[]): boolean {
  if (categoryId === Filter.ALL) return true

  return (
    tasks.some((task) => task.category?.id === categoryId) ||
    events.some((event) => event.category?.id === categoryId) ||
    notes.some((note) => note.category?.id === categoryId)
  )
}
