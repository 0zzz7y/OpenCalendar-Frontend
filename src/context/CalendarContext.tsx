import { createContext, useState, ReactNode } from "react"
import Calendar from "../type/calendar"
import useCalendars from "../hook/api/useCalendar"

interface EditorData {
  id?: string
  label: string
  emoji: string
}

interface CalendarContextState {
  calendars: Calendar[]
  selectedCalendar: string | null
  setSelectedCalendar: (val: string | null) => void

  editorOpen: boolean
  editorMode: "add" | "edit" | "delete"
  editorData: EditorData
  openEditor: (mode: "add" | "edit" | "delete", data?: EditorData) => void
  closeEditor: () => void

  reloadCalendars: () => Promise<void>
}

const CalendarContext = createContext<CalendarContextState | undefined>(
  undefined
)

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>("all")

  const [editorOpen, setEditorOpen] = useState(false)
  const [editorMode, setEditorMode] = useState<"add" | "edit" | "delete">("add")
  const [editorData, setEditorData] = useState<EditorData>({
    label: "",
    emoji: "📅"
  })

  const { calendars, reloadCalendars } = useCalendars()

  const openEditor = (
    mode: "add" | "edit" | "delete",
    data: EditorData = { label: "", emoji: "📅" }
  ) => {
    setEditorMode(mode)
    setEditorData(data)
    setEditorOpen(true)
  }

  const closeEditor = () => setEditorOpen(false)

  return (
    <CalendarContext.Provider
      value={{
        calendars,
        selectedCalendar,
        setSelectedCalendar,
        editorOpen,
        editorMode,
        editorData,
        openEditor,
        closeEditor,
        reloadCalendars
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

export default CalendarContext
