import type Calendar from "@/model/domain/calendar"
import type CalendarDto from "@/model/dto/calendar.dto"

export const dtoToCalendar = (dto: CalendarDto): Calendar => ({
  id: dto.id || "",
  name: dto.name || "",
  emoji: dto.emoji || "",
})

export const calendarToDto = (calendar: Partial<Calendar>): CalendarDto => ({
  id: calendar.id || "",
  name: calendar.name || "",
  emoji: calendar.emoji || ""
})
