import * as noteService from "@/service/note.service"
import { dtoToNote, noteToDto } from "@/model/mapper/note.mapper"
import { createCrudController } from "./crud.controller"
import useAppStore from "@/store/useAppStore"

export const {
  load: loadNotes,
  add: addNote,
  update: updateNote,
  remove: deleteNote
} = createCrudController(
  "notes",
  {
    getAll: noteService.getNotes,
    create: noteService.createNote,
    update: noteService.updateNote,
    delete: noteService.deleteNote
  },
  {
    toDto: noteToDto,
    fromDto: (dto) => dtoToNote(dto, useAppStore.getState().calendars, useAppStore.getState().categories)
  }
)
