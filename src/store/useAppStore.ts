import { create } from "zustand"
import type Calendar from "@/model/domain/calendar"
import type Category from "@/model/domain/category"
import type Event from "@/model/domain/event"
import type Task from "@/model/domain/task"
import type Note from "@/model/domain/note"

interface AppStore {
  calendars: Calendar[]
  categories: Category[]
  events: Event[]
  tasks: Task[]
  notes: Note[]

  selectedCategory: string | null
  setSelectedCategory: (id: string | null) => void

  setCalendars: (calendars: Calendar[]) => void
  setCategories: (categories: Category[]) => void
  setEvents: (events: Event[]) => void
  setTasks: (tasks: Task[]) => void
  setNotes: (notes: Note[]) => void
}

const useAppStore = create<AppStore>((set) => ({
  calendars: [],
  categories: [],
  events: [],
  tasks: [],
  notes: [],
  selectedCategory: "all",

  setSelectedCategory: (id) => set({ selectedCategory: id }),

  setCalendars: (calendars) => set({ calendars: calendars ?? [] }),
  setCategories: (categories) => set({ categories: categories ?? [] }),
  setEvents: (events) => set({ events: events ?? [] }),
  setTasks: (tasks) => set({ tasks: tasks ?? [] }),
  setNotes: (notes) => set({ notes: notes ?? [] })
}))

export default useAppStore
