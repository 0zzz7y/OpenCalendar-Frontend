import Note from "@/type/note"

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
  editorMode: "add" | "edit" | "delete"
  editorData: NoteEditorData
  openEditor: (mode: "add" | "edit" | "delete", data?: NoteEditorData) => void
  closeEditor: () => void
}
