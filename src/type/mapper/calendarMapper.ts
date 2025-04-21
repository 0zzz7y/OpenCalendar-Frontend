import CalendarDto from "../dto/calendarDto"
import Calendar from "../domain/calendar"

export const toCalendar = (dto: CalendarDto): Calendar => ({
  id: dto.id ?? "",
  name: dto.name,
  emoji: dto.emoji
})

export const toCalendarDto = (calendar: Calendar): CalendarDto => ({
  id: calendar.id,
  name: calendar.name,
  emoji: calendar.emoji
})
