import type { Calendar } from "@/features/calendar/calendar.model"
import type { CalendarDto } from "@/features/calendar/calendar.dto"

export function dtoToCalendar(dto: CalendarDto): Calendar {
  return {
    id: dto.id || "",
    name: dto.name || "",
    emoji: dto.emoji || ""
  }
}

export function calendarToDto(calendar: Partial<Calendar>): CalendarDto {
  return {
    id: calendar.id || "",
    name: calendar.name || "",
    emoji: calendar.emoji || ""
  }
}
