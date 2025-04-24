import * as eventService from "@/service/event.service";
import { dtoToEvent, eventToDto } from "@/model/mapper/event.mapper";
import { createCrudController } from "./crud.controller";
import useAppStore from "@/store/useAppStore";

export const {
  load:   loadEvents,
  add:    addEvent,
  update: updateEvent,
  remove: deleteEvent,
} = createCrudController(
  "events",
  {
    getAll: eventService.getEvents,
    create: eventService.createEvent,
    update: eventService.updateEvent,
    delete: eventService.deleteEvent,
  },
  {
    toDto:   eventToDto,
    fromDto: (dto) =>
      dtoToEvent(
        dto,
        useAppStore.getState().calendars,
        useAppStore.getState().categories
      ),
  }
);
