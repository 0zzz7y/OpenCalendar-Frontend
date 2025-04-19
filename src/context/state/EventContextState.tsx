import Event from "@/type/domain/event"
import RecurringPattern from "@/type/domain/recurringPattern"
import EditorMode from "@/type/utility/editorMode"

export interface EventEditorData {
  id?: string
  name: string
  description: string
  startDate: string
  endDate: string
  recurringPattern: RecurringPattern
  calendarId: string
  categoryId?: string
  color?: string
}

export default interface EventContextState {
  events: Event[]
  reloadEvents: () => Promise<void>

  editorOpen: boolean
  editorMode: EditorMode
  editorData: EventEditorData
  openEditor: (mode: EditorMode, data?: EventEditorData) => void
  closeEditor: () => void
}
