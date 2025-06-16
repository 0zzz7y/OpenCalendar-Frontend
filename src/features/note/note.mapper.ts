import type { Note } from "@/features/note/note.model"
import type { NoteDto } from "@/features/note/note.dto"
import type { Calendar } from "@/features/calendar/calendar.model"
import type { Category } from "@/features/category/category.model"

export function dtoToNote(dto: NoteDto, calendars: Calendar[], categories: Category[]): Note {
  return {
    id: dto.id || "",
    name: dto.name || "",
    description: dto.description || "",
    calendar: calendars.find((c) => c.id === dto.calendarId) as Calendar,
    category: categories.find((c) => c.id === dto.categoryId) as Category
  }
}

export function noteToDto(note: Partial<Note>): NoteDto {
  return {
    id: note.id || "",
    name: note.name || "",
    description: note.description || "",
    calendarId: note.calendar?.id || "",
    categoryId: note.category?.id || ""
  }
}
