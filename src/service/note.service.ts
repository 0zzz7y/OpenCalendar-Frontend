import type NoteDto from "@/model/dto/note.dto"
import { createCrudService } from "./crud.service"

export const {
  getAll: getNotes,
  create: createNote,
  update: updateNote,
  delete: deleteNote
} = createCrudService<NoteDto>(`${import.meta.env.VITE_API_URL}/notes`)
