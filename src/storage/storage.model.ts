import type { Calendar } from "@/features/calendar/calendar.model"
import type { Category } from "@/features/category/category.model"
import type { Event } from "@/features/event/event.model"
import type { Task } from "@/features/task/task.model"
import type { Note } from "@/features/note/note.model"

export interface Storage {
  calendars: Calendar[]
  categories: Category[]
  events: Event[]
  tasks: Task[]
  notes: Note[]

  selectedCalendar: string | null
  selectedCategory: string | null

  setCalendars: (calendars: Calendar[]) => void
  setCategories: (categories: Category[]) => void
  setEvents: (events: Event[]) => void
  setTasks: (tasks: Task[]) => void
  setNotes: (notes: Note[]) => void

  setSelectedCalendar: (id: string | null) => void
  setSelectedCategory: (id: string | null) => void
}
