import { createCrudController } from "@/features/crud/crud.controller"

import { useApiUrl } from "@/utilities/api.utility"

import type { NoteDto } from "@/features/note/note.dto"

export function useNoteController() {
  const apiUrl = useApiUrl()
  return createCrudController<NoteDto>(`${apiUrl}/api/v1/notes`)
}
