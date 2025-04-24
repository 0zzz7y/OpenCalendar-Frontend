import * as calendarService from "@/service/calendar.service";
import { dtoToCalendar, calendarToDto } from "@/model/mapper/calendar.mapper";
import { createCrudController } from "./crud.controller";

export const {
  load:   loadCalendars,
  add:    addCalendar,
  update: updateCalendar,
  remove: deleteCalendar,
} = createCrudController(
  "calendars",
  {
    getAll: calendarService.getCalendars,
    create: calendarService.createCalendar,
    update: calendarService.updateCalendar,
    delete: calendarService.deleteCalendar,
  },
  {
    toDto:   calendarToDto,
    fromDto: dtoToCalendar,
  }
);
