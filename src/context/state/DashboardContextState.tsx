import Calendar from "@/type/domain/calendar"
import Category from "@/type/domain/category"
import Note from "@/type/domain/note"
import Event from "@/type/domain/event"
import Task from "@/type/domain/task"

interface DashboardContextState {
  calendars: Calendar[]
  categories: Category[]
  notes: Note[]
  events: Event[]
  tasks: Task[]

  reloadCalendars: () => Promise<void>
  reloadCategories: () => Promise<void>
  reloadNotes: () => Promise<void>
  reloadEvents: () => Promise<void>
  reloadTasks: () => Promise<void>
}
