import Event from "@/type/event"

export interface EventEditorData {
  id?: string
  name: string
  description: string
  startDate: string
  endDate: string
  calendarId: string
  categoryId?: string
  color?: string
}

export default interface EventContextState {
  events: Event[]
  reloadEvents: () => Promise<void>

  editorOpen: boolean
  editorMode: "add" | "edit" | "delete"
  editorData: EventEditorData
  openEditor: (mode: "add" | "edit" | "delete", data?: EventEditorData) => void
  closeEditor: () => void
}
