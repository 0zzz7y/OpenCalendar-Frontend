import React, { createContext, useContext, useState, ReactNode } from "react"
import Calendar from "@/type/domain/calendar"
import Category from "@/type/domain/category"
import Note from "@/type/domain/note"
import Event from "@/type/domain/event"
import Task from "@/type/domain/task"
import useCalendars from "@/hook/api/useCalendar"
import useCategories from "@/hook/api/useCategory"
import useNotes from "@/hook/api/useNote"
import useEvents from "@/hook/api/useEvent"
import useTasks from "@/hook/api/useTask"
import EditorMode from "@/type/utility/editorMode"
import EditorData from "@/type/utility/editorData"
import EditorType from "@/type/utility/editorType"

interface AppContextState {
  calendars: Calendar[]
  selectedCalendar: string | null
  setSelectedCalendar: (val: string | null) => void

  categories: Category[]
  selectedCategory: string | null
  setSelectedCategory: (val: string | null) => void

  events: Event[]
  tasks: Task[]
  notes: Note[]

  editorOpen: boolean
  editorType: EditorType
  editorMode: EditorMode
  editorData: EditorData
  openEditor: (type: EditorType, mode: EditorMode, data?: EditorData) => void
  closeEditor: () => void

  reloadCalendars: () => Promise<void>
  reloadCategories: () => Promise<void>
  reloadEvents: () => Promise<void>
  reloadTasks: () => Promise<void>
  reloadNotes: () => Promise<void>

  addCalendar: (calendar: Omit<Calendar, "id">) => Promise<Calendar>
  updateCalendar: (id: string, updated: Partial<Calendar>) => Promise<void>
  deleteCalendar: (id: string) => Promise<void>

  addCategory: (category: Omit<Category, "id">) => Promise<Category>
  updateCategory: (id: string, updated: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>

  addEvent: (event: Omit<Event, "id">) => Promise<Event>
  updateEvent: (id: string, updated: Partial<Event>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>

  addTask: (task: Omit<Task, "id">) => Promise<Task>
  updateTask: (id: string, updated: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>

  addNote: (note: Omit<Note, "id">) => Promise<Note>
  updateNote: (id: string, updated: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
}

const AppContext = createContext<AppContextState | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>("all")
  const [selectedCategory, setSelectedCategory] = useState<string | null>("all")
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorType, setEditorType] = useState<EditorType>(EditorType.CALENDAR)
  const [editorMode, setEditorMode] = useState<EditorMode>(EditorMode.ADD)
  const [editorData, setEditorData] = useState<EditorData>({
    label: "",
    emoji: "📅"
  })

  const {
    calendars,
    reloadCalendars,
    addCalendar,
    updateCalendar,
    deleteCalendar
  } = useCalendars()
  const {
    categories,
    reloadCategories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useCategories()
  const { events, reloadEvents, addEvent, updateEvent, deleteEvent } =
    useEvents()
  const { tasks, reloadTasks, addTask, updateTask, deleteTask } = useTasks()
  const { notes, reloadNotes, addNote, updateNote, deleteNote } = useNotes()

  const openEditor = (
    type: EditorType,
    mode: EditorMode,
    data: EditorData = { label: "", emoji: "📅" }
  ) => {
    setEditorType(type)
    setEditorMode(mode)
    setEditorData(data)
    setEditorOpen(true)
  }

  const closeEditor = () => setEditorOpen(false)

  return (
    <AppContext.Provider
      value={{
        calendars,
        selectedCalendar,
        setSelectedCalendar,
        categories,
        selectedCategory,
        setSelectedCategory,
        events,
        tasks,
        notes,
        editorOpen,
        editorType,
        editorMode,
        editorData,
        openEditor,
        closeEditor,
        reloadCalendars,
        reloadCategories,
        reloadEvents,
        reloadTasks,
        reloadNotes,
        addCalendar,
        updateCalendar,
        deleteCalendar,
        addCategory,
        updateCategory,
        deleteCategory,
        addEvent,
        updateEvent,
        deleteEvent,
        addTask,
        updateTask,
        deleteTask,
        addNote,
        updateNote,
        deleteNote
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppContext
