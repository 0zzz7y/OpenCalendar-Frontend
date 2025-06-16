import { create } from "zustand"

import type { Storage } from "@/storage/storage.model"
import type { Calendar } from "@/features/calendar/calendar.model"
import type { Category } from "@/features/category/category.model"
import type { Event } from "@/features/event/event.model"
import type { Task } from "@/features/task/task.model"
import type { Note } from "@/features/note/note.model"

import { Filter } from "@/features/filter/filter.type"

const ensureIsArray = <T>(value: unknown): T[] => (Array.isArray(value) ? value : [])

export const useStorage = create<Storage>((set) => ({
  calendars: [],
  categories: [],
  events: [],
  tasks: [],
  notes: [],

  selectedCalendar: Filter.ALL,
  selectedCategory: Filter.ALL,

  setCalendars: (calendars) => set({ calendars: ensureIsArray<Calendar>(calendars) }),
  setCategories: (categories) => set({ categories: ensureIsArray<Category>(categories) }),
  setEvents: (events) => set({ events: ensureIsArray<Event>(events) }),
  setTasks: (tasks) => set({ tasks: ensureIsArray<Task>(tasks) }),
  setNotes: (notes) => set({ notes: ensureIsArray<Note>(notes) }),

  setSelectedCalendar: (id) => set({ selectedCalendar: id }),
  setSelectedCategory: (id) => set({ selectedCategory: id })
}))
