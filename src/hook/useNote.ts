import { useCallback } from "react"
import {
  getNotes,
  createNote,
  updateNote as serviceUpdate,
  deleteNote as serviceDelete
} from "@/service/note.service"
import useAppStore from "@/store/useAppStore"
import type Note from "@/model/domain/note"

const useNote = () => {
  const { notes, setNotes } = useAppStore()

  const reloadNotes = useCallback(async () => {
    const data = await getNotes()
    setNotes(data)
  }, [setNotes])

  const addNote = useCallback(async (note: Partial<Note>) => {
    const created = await createNote(note)
    setNotes([...notes, created])
    return created
  }, [notes, setNotes])

  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    const updated = await serviceUpdate(id, updates)
    setNotes(notes.map((n) => (n.id === id ? updated : n)))
    return updated
  }, [notes, setNotes])

  const deleteNote = useCallback(async (id: string) => {
    await serviceDelete(id)
    setNotes(notes.filter((n) => n.id !== id))
  }, [notes, setNotes])

  return {
    reloadNotes,
    addNote,
    updateNote,
    deleteNote
  }
}

export default useNote
