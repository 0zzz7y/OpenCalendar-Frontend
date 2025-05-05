/**
 * Copyright (c) Tomasz Wnuk
 */

import type NoteDto from "@/model/dto/note.dto"
import { createCrudService } from "./crud.service"
import getServiceUrl from "@/utilities/getServiceUrl"

const serviceUrl = getServiceUrl("notes")

export const {
  getAll: getNotes,
  create: createNote,
  update: updateNote,
  delete: deleteNote
} = createCrudService<NoteDto>(`${serviceUrl}/notes`)
