import useAppStore from "@/store/useAppStore"
import * as noteService from "@/service/note.service"
import type Note from "@/model/domain/note"

export const loadNotes = async () => {
  const notes = await noteService.getNotes()
  useAppStore.getState().setNotes(notes)
}

export const addNote = async (note: Partial<Note>) => {
  const created = await noteService.createNote(note)
  useAppStore.getState().setNotes([...useAppStore.getState().notes, created])
}

export const updateNote = async (note: Note) => {
  const updated = await noteService.updateNote(note.id, note)
  useAppStore.getState().setNotes(
    useAppStore.getState().notes.map((n) => (n.id === updated.id ? updated : n))
  )
}

export const deleteNote = async (id: string) => {
  await noteService.deleteNote(id)
  useAppStore.getState().setNotes(
    useAppStore.getState().notes.filter((n) => n.id !== id)
  )
}