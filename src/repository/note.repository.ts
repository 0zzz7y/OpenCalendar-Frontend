import {
  getNotes,
  createNote,
  updateNote as serviceUpdateNote,
  deleteNote as serviceDeleteNote
} from "@/service/note.service"
import { noteToDto, dtoToNote } from "@/model/mapper/note.mapper"
import type Note from "@/model/domain/note"
import type NoteDto from "@/model/dto/note.dto"
import { createUseCrud } from "@/repository/crud.repository"
import useAppStore from "@/store/useAppStore"

const useCrudNote = () => {
  const { calendars, categories } = useAppStore()
  return createUseCrud<Note, NoteDto, NoteDto>(
    "notes",
    {
      getAll: getNotes,
      create: createNote,
      update: serviceUpdateNote,
      delete: serviceDeleteNote
    },
    noteToDto,
    (dto) => dtoToNote(dto, calendars, categories)
  )()
}

export function useNote() {
  const { reload, add, update, remove } = useCrudNote()
  return {
    reloadNotes: reload,
    addNote: add,
    updateNote: update,
    deleteNote: remove
  }
}

export default useNote
