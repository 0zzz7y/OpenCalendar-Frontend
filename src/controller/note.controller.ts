/**
 * Copyright (c) Tomasz Wnuk
 */

import * as noteService from "@/service/note.service"
import { dtoToNote, noteToDto } from "@/model/mapper/note.mapper"
import { createCrudController } from "./crud.controller"
import useApplicationStorage from "@/storage/useApplicationStorage"

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
    fromDto: (dto) =>
      dtoToNote(dto, useApplicationStorage.getState().calendars, useApplicationStorage.getState().categories)
  }
)
