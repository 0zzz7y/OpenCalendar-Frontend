import { createCrudService } from "@/features/crud/crud.service"

import { useStorage } from "@/storage/useStorage.hook"

import { useEventController } from "@/features/event/event.controller"
import { useEventRepository } from "@/features/event/event.repository"
import type { Event } from "@/features/event/event.model"
import type { EventDto } from "@/features/event/event.dto"
import { eventToDto, dtoToEvent } from "@/features/event/event.mapper"
import { validateEvent } from "@/features/event/event.validation"

export function useEventService() {
  const controller = useEventController()
  const repository = useEventRepository()
  const { calendars, categories } = useStorage()

  return createCrudService<Event, EventDto, EventDto>(
    controller,
    repository,
    eventToDto,
    (dto: EventDto) => dtoToEvent(dto, calendars, categories),
    validateEvent
  )
}
