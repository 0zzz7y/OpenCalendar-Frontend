import {
  getCalendars,
  createCalendar,
  updateCalendar as serviceUpdateCalendar,
  deleteCalendar as serviceDeleteCalendar
} from "@/service/calendar.service"
import { calendarToDto, dtoToCalendar } from "@/model/mapper/calendar.mapper"
import type Calendar from "@/model/domain/calendar"
import type CalendarDto from "@/model/dto/calendar.dto"
import { createUseCrud } from "@/repository/crud.repository"
import MESSAGE from "@/constant/ui/message"

const useCrudCalendar = createUseCrud<Calendar, CalendarDto, CalendarDto>(
  "calendars",
  {
    getAll: getCalendars,
    create: createCalendar,
    update: serviceUpdateCalendar,
    delete: serviceDeleteCalendar
  },
  calendarToDto,
  dtoToCalendar,
  (domain: Partial<Calendar>) => {
    if (!domain.name) {
      throw new Error("Calendar name is required.")
    }
  }
)

export function useCalendar() {
  const { reload, add, update, remove } = useCrudCalendar()

  const addCalendar = async (data: Partial<Calendar>): Promise<Calendar> => {
    try {
      const savedCalendar = await add(data)
      return savedCalendar
    } catch {
      throw new Error(MESSAGE.CALENDAR_CREATE_FAILED)
    }
  }

  const updateCalendar = async (data: Partial<Calendar> & { id: string }): Promise<Calendar> => {
    try {
      const updatedCalendar = await update(data)
      return updatedCalendar
    } catch {
      throw new Error(MESSAGE.CALENDAR_CREATE_FAILED)
    }
  }

  const deleteCalendar = async (id: string): Promise<void> => {
    try {
      await remove(id)
    } catch {
      throw new Error(MESSAGE.CALENDAR_DELETE_FAILED)
    }
  }

  return {
    reloadCalendars: reload,
    addCalendar,
    updateCalendar,
    deleteCalendar
  }
}

export default useCalendar
