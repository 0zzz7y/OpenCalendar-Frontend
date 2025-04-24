import type Note from "@/model/domain/note"
import type NoteDto from "@/model/dto/note.dto"
import type Calendar from "@/model/domain/calendar"
import type Category from "@/model/domain/category"

export const dtoToNote = (
  dto: NoteDto,
  calendars: Calendar[],
  categories: Category[]
): Note => ({
  id: dto.id || "",
  name: dto.name || "",
  description: dto.description || "",
  positionX: Math.floor(Math.random() * 100),
  positionY: Math.floor(Math.random() * 100),
  calendar: calendars.find((c) => c.id === dto.calendarId)! || "",
  category: categories.find((c) => c.id === dto.categoryId)! || ""
})

export const noteToDto = (note: Partial<Note>): NoteDto => ({
  id: note.id || "",
  name: note.name || "",
  description: note.description || "",
  calendarId: note.calendar?.id || "",
  categoryId: note.category?.id || ""
})
