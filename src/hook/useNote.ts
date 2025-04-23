// hook/useNote.ts
import { useCallback } from "react"
import { getNotes, createNote, updateNote, deleteNote } from "@/service/note.service"
import useAppStore from "@/store/useAppStore"
import type Note from "@/model/domain/note"

const useNote = () => {
  const setNotes = useAppStore((state: { setNotes: (notes: Note[]) => void }) => state.setNotes)

  const reloadNotes = useCallback(async () => {
    const data = await getNotes()
    setNotes(data)
  }, [setNotes])

  const addNote = useCallback(async (note: Partial<Note>) => {
    return await createNote(note)
  }, [])

  const updateNoteById = useCallback(async (id: string, updates: Partial<Note>) => {
    return await updateNote(id, updates)
  }, [])

  const deleteNoteById = useCallback(async (id: string) => {
    return await deleteNote(id)
  }, [])

  return {
    reloadNotes,
    addNote,
    updateNote: updateNoteById,
    deleteNote: deleteNoteById
  }
}

export default useNote
