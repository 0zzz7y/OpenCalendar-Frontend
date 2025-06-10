import type NoteDto from "@/model/dto/note.dto"
import { createCrudService } from "./crud.service"

const serviceUrl = import.meta.env.VITE_API_URL || "http://localhost:8080"

export const {
  getAll: getNotes,
  create: createNote,
  update: updateNote,
  delete: deleteNote
} = createCrudService<NoteDto>(`${serviceUrl}/notes`)
