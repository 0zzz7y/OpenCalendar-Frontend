import Calendar from "../domain/calendar"
import Category from "../domain/category"
import Note from "../domain/note"
import NoteDto from "../dto/noteDto"

export const toNote = (
  dto: NoteDto,
  calendar: Calendar,
  category?: Category
): Note => ({
  id: dto.id ?? "",
  name: dto.name,
  description: dto.description,
  calendar,
  category
})

export const toNoteDto = (note: Note): NoteDto => ({
  id: note.id,
  name: note.name,
  description: note.description,
  calendarId: note.calendar.id,
  categoryId: note.category?.id
})
