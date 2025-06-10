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
import useApplicationStorage from "@/storage/useApplicationStorage"
import MESSAGE from "@/constant/ui/message"

const useCrudEvent = () => {
  const { calendars, categories } = useApplicationStorage()
  const validateEvent = (event: Partial<Event>) => {
    if (!event.name) {
      throw new Error("Event name is required.")
    }
    if (!event.startDate) {
      throw new Error("Event start date is required.")
    }
  }

  return createUseCrud<Event, EventDto, EventDto>(
    "events",
    {
      getAll: getEvents,
      create: createEvent,
      update: serviceUpdateEvent,
      delete: serviceDeleteEvent
    },
    eventToDto,
    (dto) => dtoToEvent(dto, calendars, categories),
    validateEvent
  )()
}

export function useEvent() {
  const { reload, add, update, remove } = useCrudEvent()

  const addEvent = async (data: Partial<Event>): Promise<Event> => {
    try {
      const savedEvent = await add(data)
      return savedEvent
    } catch {
      throw new Error(MESSAGE.EVENT_CREATE_FAILED)
    }
  }

  const updateEvent = async (data: Partial<Event> & { id: string }): Promise<Event> => {
    try {
      const updatedEvent = await update(data)
      return updatedEvent
    } catch {
      throw new Error(MESSAGE.EVENT_CREATE_FAILED)
    }
  }

  const deleteEvent = async (id: string): Promise<void> => {
    try {
      await remove(id)
    } catch {
      throw new Error(MESSAGE.EVENT_DELETE_FAILED)
    }
  }

  return {
    reloadEvents: reload,
    addEvent,
    updateEvent,
    deleteEvent
  }
}

export default useEvent
