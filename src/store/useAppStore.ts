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

  selectedCalendar: string | null
  setSelectedCalendar: (id: string | null) => void

  selectedCategory: string | null
  setSelectedCategory: (id: string | null) => void

  setCalendars: (calendars: unknown) => void
  setCategories: (categories: unknown) => void
  setEvents: (events: unknown) => void
  setTasks: (tasks: unknown) => void
  setNotes: (notes: unknown) => void
}

const ensureArray = <T>(value: unknown): T[] => Array.isArray(value) ? value : []

const useAppStore = create<AppStore>((set) => ({
  calendars: [],
  categories: [],
  events: [],
  tasks: [],
  notes: [],

  selectedCalendar: "all",
  setSelectedCalendar: (id) => set({ selectedCalendar: id }),

  selectedCategory: "all",
  setSelectedCategory: (id) => set({ selectedCategory: id }),

  setCalendars: (calendars) => set({ calendars: ensureArray<Calendar>(calendars) }),
  setCategories: (categories) => set({ categories: ensureArray<Category>(categories) }),
  setEvents: (events) => set({ events: ensureArray<Event>(events) }),
  setTasks: (tasks) => set({ tasks: ensureArray<Task>(tasks) }),
  setNotes: (notes) => set({ notes: ensureArray<Note>(notes) })
}))

export default useAppStore
