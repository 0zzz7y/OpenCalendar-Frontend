import type Calendar from "@/model/domain/calendar";
import type CalendarDto from "@/model/dto/calendar.dto";

export function dtoToCalendar(dto: CalendarDto): Calendar {
  return {
    id: dto.id ?? "",
    name: dto.name,
    emoji: dto.emoji,
  };
}

export function calendarToDto(calendar: Partial<Calendar>): CalendarDto {
  return {
    id: calendar.id,
    name: calendar.name!,
    emoji: calendar.emoji!,
  };
}