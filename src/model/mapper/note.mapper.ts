import type Note from "@/model/domain/note"
import type NoteDto from "@/model/dto/note.dto"
import type Calendar from "@/model/domain/calendar"
import type Category from "@/model/domain/category"

export function dtoToNote(dto: NoteDto, calendars: Calendar[], categories: Category[]): Note {
  return {
    id: dto.id ?? "",
    name: dto.name,
    description: dto.description,
    calendar: calendars.find((c) => c.id === dto.calendarId) as Calendar,
    category: categories.find((c) => c.id === dto.categoryId) as Category,
    positionX: Math.floor(Math.random() * 100),
    positionY: Math.floor(Math.random() * 100)
  }
}

export function noteToDto(note: Partial<Note>): NoteDto {
  return {
    id: note.id,
    name: note.name,
    description: note.description ?? "",
    calendarId: note.calendar?.id ?? "",
    categoryId: note.category?.id
  }
}
