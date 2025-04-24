import type NoteDto from "@/model/dto/note.dto";
import { createCrudService } from "./crud.service";
export const { getAll: getNotes, create: createNote, update: updateNote, delete: deleteNote } =
  createCrudService<NoteDto>("notes");
