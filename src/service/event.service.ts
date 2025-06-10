import type EventDto from "@/model/dto/event.dto"
import { createCrudService } from "./crud.service"

const serviceUrl = import.meta.env.VITE_API_URL || "http://localhost:8080"

export const {
  getAll: getEvents,
  create: createEvent,
  update: updateEvent,
  delete: deleteEvent
} = createCrudService<EventDto>(`${serviceUrl}/events`)
