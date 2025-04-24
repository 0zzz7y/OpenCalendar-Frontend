import type Event from "@/model/domain/event";
import type EventDto from "@/model/dto/event.dto";
import type Calendar from "@/model/domain/calendar";
import type Category from "@/model/domain/category";

export function dtoToEvent(
  dto: EventDto,
  calendars: Calendar[],
  categories: Category[]
): Event {
  return {
    id: dto.id ?? "",
    name: dto.name,
    description: dto.description,
    startDate: dto.startDate,
    endDate: dto.endDate,
    recurringPattern: dto.recurringPattern,
    calendar: calendars.find(c => c.id === dto.calendarId)!,
    category: categories.find(c => c.id === dto.categoryId)!,
  };
}

export function eventToDto(event: Partial<Event>): EventDto {
  return {
    id: event.id,
    name: event.name!,
    description: event.description,
    startDate: event.startDate!,
    endDate: event.endDate!,
    recurringPattern: event.recurringPattern!,
    calendarId: event.calendar!.id,
    categoryId: event.category?.id,
  };
}