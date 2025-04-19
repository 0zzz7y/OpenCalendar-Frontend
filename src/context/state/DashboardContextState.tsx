import Calendar from "../../type/calendar"
import Category from "../../type/category"
import Note from "../../type/note"
import Event from "../../type/event"
import Task from "../../type/task"

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
