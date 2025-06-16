import { createCrudRepository } from "@/features/crud/crud.repository"

import type { Note } from "@/features/note/note.model"

export function useNoteRepository() {
  return createCrudRepository<Note>("notes")
}
