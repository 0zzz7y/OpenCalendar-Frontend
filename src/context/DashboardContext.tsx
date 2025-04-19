import { createContext, useContext, ReactNode } from "react"

import Calendar from "../type/calendar"
import Category from "../type/category"
import Note from "../type/note"
import Event from "../type/event"
import Task from "../type/task"

import useCalendars from "../hook/api/useCalendar"
import useCategories from "../hook/api/useCategory"
import useNotes from "../hook/api/useNote"
import useEvents from "../hook/api/useEvent"
import useTasks from "../hook/api/useTask"

export interface DashboardContextState {
  calendars: Calendar[]
  addCalendar: (calendar: Omit<Calendar, "id">) => Promise<Calendar>
  updateCalendar: (id: string, updated: Partial<Calendar>) => Promise<void>
  deleteCalendar: (id: string) => Promise<void>
  reloadCalendars: () => Promise<void>

  categories: Category[]
  addCategory: (category: Omit<Category, "id">) => Promise<Category>
  updateCategory: (id: string, updated: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  reloadCategories: () => Promise<void>

  notes: Note[]
  addNote: (note: Omit<Note, "id">) => Promise<Note>
  updateNote: (id: string, updated: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  reloadNotes: () => Promise<void>

  events: Event[]
  addEvent: (event: Omit<Event, "id">) => Promise<Event>
  updateEvent: (id: string, updated: Partial<Event>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  reloadEvents: () => Promise<void>

  tasks: Task[]
  addTask: (task: Omit<Task, "id">) => Promise<Task>
  updateTask: (id: string, updated: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  reloadTasks: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextState | undefined>(
  undefined
)

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const {
    calendars,
    addCalendar,
    updateCalendar,
    deleteCalendar,
    reloadCalendars
  } = useCalendars()

  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    reloadCategories
  } = useCategories()

  const { notes, addNote, updateNote, deleteNote, reloadNotes } = useNotes()

  const { events, addEvent, updateEvent, deleteEvent, reloadEvents } =
    useEvents()

  const { tasks, addTask, updateTask, deleteTask, reloadTasks } = useTasks()

  return (
    <DashboardContext.Provider
      value={{
        calendars,
        addCalendar,
        updateCalendar,
        deleteCalendar,
        reloadCalendars,

        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        reloadCategories,

        notes,
        addNote,
        updateNote,
        deleteNote,
        reloadNotes,

        events,
        addEvent,
        updateEvent,
        deleteEvent,
        reloadEvents,

        tasks,
        addTask,
        updateTask,
        deleteTask,
        reloadTasks
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export default DashboardContext
