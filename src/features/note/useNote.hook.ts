import { useNoteService } from "@/features/note/note.service"

export function useNote() {
  const { reload, add, update, remove } = useNoteService()

  return {
    reloadNotes: reload,
    addNote: add,
    updateNote: update,
    deleteNote: remove
  }
}
