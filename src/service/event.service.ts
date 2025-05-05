/**
 * Copyright (c) Tomasz Wnuk
 */

import type EventDto from "@/model/dto/event.dto"
import { createCrudService } from "./crud.service"
import getServiceUrl from "@/utilities/getServiceUrl"

const serviceUrl = getServiceUrl("events")

export const {
  getAll: getEvents,
  create: createEvent,
  update: updateEvent,
  delete: deleteEvent
} = createCrudService<EventDto>(`${serviceUrl}/events`)
