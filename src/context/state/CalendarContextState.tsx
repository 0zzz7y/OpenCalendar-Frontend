import Calendar from "@/type/calendar"

interface CalendarContextState {
  calendars: Calendar[]
  selectedCalendar: string | null
  setSelectedCalendar: (id: string | null) => void

  editorOpen: boolean
  editorMode: "add" | "edit" | "delete"
  editorData: { id?: string; label: string; emoji: string }

  openEditor: (
    mode: "add" | "edit" | "delete",
    data?: { id?: string; label?: string; emoji?: string }
  ) => void
  closeEditor: () => void
  reloadCalendars: () => Promise<void>
}
