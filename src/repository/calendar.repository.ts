import {
  getCalendars,
  createCalendar,
  updateCalendar as serviceUpdateCalendar,
  deleteCalendar as serviceDeleteCalendar
} from "@/service/calendar.service";
import { calendarToDto, dtoToCalendar } from "@/model/mapper/calendar.mapper";
import type Calendar from "@/model/domain/calendar";
import type CalendarDto from "@/model/dto/calendar.dto";
import { createUseCrud } from "@/repository/crud.repository";

const useCrudCalendar = createUseCrud<Calendar, CalendarDto, CalendarDto>(
  "calendars",
  {
    getAll: getCalendars,
    create: createCalendar,
    update: serviceUpdateCalendar,
    delete: serviceDeleteCalendar
  },
  calendarToDto,
  dtoToCalendar
);

export function useCalendar() {
  const { reload, add, update, remove } = useCrudCalendar();
  return {
    reloadCalendars: reload,
    addCalendar: add,
    updateCalendar: update,
    deleteCalendar: remove
  };
}

export default useCalendar
