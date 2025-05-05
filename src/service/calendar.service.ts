/**
 * Copyright (c) Tomasz Wnuk
 */

import type CalendarDto from "@/model/dto/calendar.dto"
import { createCrudService } from "./crud.service"
import getServiceUrl from "@/utilities/getServiceUrl"

const serviceUrl = getServiceUrl("calendars")

export const {
  getAll: getCalendars,
  create: createCalendar,
  update: updateCalendar,
  delete: deleteCalendar
} = createCrudService<CalendarDto>(`${serviceUrl}/calendars`)
