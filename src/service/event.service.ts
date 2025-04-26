import type EventDto from "@/model/dto/event.dto"
import { createCrudService } from "./crud.service"

export const {
  getAll: getEvents,
  create: createEvent,
  update: updateEvent,
  delete: deleteEvent
} = createCrudService<EventDto>(`${import.meta.env.VITE_API_URL}/events`)
