import {
  getEvents,
  createEvent,
  updateEvent as serviceUpdateEvent,
  deleteEvent as serviceDeleteEvent
} from "@/service/event.service"
import { eventToDto, dtoToEvent } from "@/model/mapper/event.mapper"
import type Event from "@/model/domain/event"
import type EventDto from "@/model/dto/event.dto"
import { createUseCrud } from "@/repository/crud.repository"
import useAppStore from "@/store/useAppStore"

const useCrudEvent = () => {
  const { calendars, categories } = useAppStore()
  return createUseCrud<Event, EventDto, EventDto>(
    "events",
    {
      getAll: getEvents,
      create: createEvent,
      update: serviceUpdateEvent,
      delete: serviceDeleteEvent
    },
    eventToDto,
    (dto) => dtoToEvent(dto, calendars, categories)
  )()
}

export function useEvent() {
  const { reload, add, update, remove } = useCrudEvent()
  return {
    reloadEvents: reload,
    addEvent: add,
    updateEvent: update,
    deleteEvent: remove
  }
}

export default useEvent
