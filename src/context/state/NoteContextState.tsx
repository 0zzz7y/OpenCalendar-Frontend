import Note from "@/type/domain/note"
import EditorMode from "@/type/utility/editorMode"

export interface NoteEditorData {
  id?: string
  name: string
  description: string
  calendarId: string
  categoryId: string
}

export default interface NoteContextState {
  notes: Note[]
  reloadNotes: () => Promise<void>

  editorOpen: boolean
  editorMode: EditorMode
  editorData: NoteEditorData
  openEditor: (mode: EditorMode, data?: NoteEditorData) => void
  closeEditor: () => void
}
