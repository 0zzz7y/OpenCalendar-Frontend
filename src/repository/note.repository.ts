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
import useApplicationStorage from "@/storage/useApplicationStorage"
import { showToast } from "@/component/toast/Toast"
import MESSAGE from "@/constant/ui/message"

const useCrudNote = () => {
  const { calendars, categories } = useApplicationStorage()
  const validateNote = (note: Partial<Note>) => {
    if (!note.title || note.title.trim() === "") {
      throw new Error("Note title is required.")
    }
  }

  return createUseCrud<Note, NoteDto, NoteDto>(
    "notes",
    {
      getAll: getNotes,
      create: createNote,
      update: serviceUpdateNote,
      delete: serviceDeleteNote
    },
    noteToDto,
    (dto) => dtoToNote(dto, calendars, categories),
    validateNote
  )()
}

export function useNote() {
  const { reload, add, update, remove } = useCrudNote()

  const addNote = async (data: Partial<Note>): Promise<Note> => {
    try {
      const savedNote = await add(data)
      showToast("success", MESSAGE.NOTE_CREATED_SUCCESSFULLY)
      return savedNote
    } catch {
      showToast("error", MESSAGE.NOTE_CREATE_FAILED)
      throw new Error(MESSAGE.NOTE_CREATE_FAILED)
    }
  }

  const updateNote = async (data: Partial<Note> & { id: string }): Promise<Note> => {
    try {
      const updatedNote = await update(data)
      showToast("success", MESSAGE.NOTE_UPDATED_SUCCESSFULLY)
      return updatedNote
    } catch {
      showToast("error", MESSAGE.NOTE_CREATE_FAILED)
      throw new Error(MESSAGE.NOTE_CREATE_FAILED)
    }
  }

  const deleteNote = async (id: string): Promise<void> => {
    try {
      await remove(id)
      showToast("success", MESSAGE.NOTE_DELETED_SUCCESSFULLY)
    } catch {
      showToast("error", MESSAGE.NOTE_DELETE_FAILED)
      throw new Error(MESSAGE.NOTE_DELETE_FAILED)
    }
  }

  return {
    reloadNotes: reload,
    addNote,
    updateNote,
    deleteNote
  }
}

export default useNote
