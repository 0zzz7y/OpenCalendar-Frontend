import useCalendars from "@/hook/api/useCalendar"
import useCategories from "@/hook/api/useCategory"
import useEvents from "@/hook/api/useEvent"
import useNotes from "@/hook/api/useNote"
import useTasks from "@/hook/api/useTask"
import Calendar from "@/type/domain/calendar"
import Category from "@/type/domain/category"
import Event from "@/type/domain/event"
import Note from "@/type/domain/note"
import Task from "@/type/domain/task"
import EditorData from "@/type/utility/editorData"
import EditorMode from "@/type/utility/editorMode"
import EditorType from "@/type/utility/editorType"

import { createContext, useState, ReactNode } from "react"

interface AppContextState {
  calendars: Calendar[]
  selectedCalendar: string | null
  setSelectedCalendar: (val: string | null) => void
  addCalendar: (calendar: Omit<Calendar, "id">) => Promise<Calendar>
  updateCalendar: (id: string, updated: Partial<Calendar>) => Promise<void>
  deleteCalendar: (id: string) => Promise<void>
  reloadCalendars: () => Promise<void>

  categories: Category[]
  selectedCategory: string | null
  setSelectedCategory: (val: string | null) => void
  addCategory: (category: Omit<Category, "id">) => Promise<Category>
  updateCategory: (id: string, updated: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  reloadCategories: () => Promise<void>

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

  notes: Note[]
  addNote: (note: Omit<Note, "id">) => Promise<Note>
  updateNote: (id: string, updated: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  reloadNotes: () => Promise<void>

  editorOpen: boolean
  editorType: EditorType
  editorMode: EditorMode
  editorData: EditorData
  openEditor: (type: EditorType, mode: EditorMode, data?: EditorData) => void
  closeEditor: () => void
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
        addCalendar,
        updateCalendar,
        deleteCalendar,
        reloadCalendars,

        categories,
        selectedCategory,
        setSelectedCategory,
        addCategory,
        updateCategory,
        deleteCategory,
        reloadCategories,

        events,
        addEvent,
        updateEvent,
        deleteEvent,
        reloadEvents,

        tasks,
        addTask,
        updateTask,
        deleteTask,
        reloadTasks,

        notes,
        addNote,
        updateNote,
        deleteNote,
        reloadNotes,

        editorOpen,
        editorType,
        editorMode,
        editorData,
        openEditor,
        closeEditor
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppContext
