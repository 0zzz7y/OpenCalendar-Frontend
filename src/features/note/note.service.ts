import { createCrudService } from "@/features/crud/crud.service"

import { useStorage } from "@/storage/useStorage.hook"

import { useNoteController } from "@/features/note/note.controller"
import { useNoteRepository } from "@/features/note/note.repository"
import type { Note } from "@/features/note/note.model"
import type { NoteDto } from "@/features/note/note.dto"
import { noteToDto, dtoToNote } from "@/features/note/note.mapper"
import { validateNote } from "@/features/note/note.validation"

function useNoteService() {
  const controller = useNoteController()
  const repository = useNoteRepository()
  const { calendars, categories } = useStorage()

  return createCrudService<Note, NoteDto, NoteDto>(
    controller,
    repository,
    noteToDto,
    (dto: NoteDto) => dtoToNote(dto, calendars, categories),
    validateNote
  )
}

export { useNoteService }
