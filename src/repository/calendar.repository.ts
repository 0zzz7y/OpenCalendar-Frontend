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
import { showToast } from "@/utilities/toastNotifications"
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

  const addCalendar = async (data: Partial<Calendar>) => {
    try {
      await add(data)
      showToast("success", MESSAGE.CALENDAR_CREATED_SUCCESSFULLY)
    } catch {
      showToast("error", MESSAGE.CALENDAR_SAVE_FAILED)
    }
  }

  const updateCalendar = async (data: Partial<Calendar> & { id: string }) => {
    try {
      await update(data)
      showToast("success", MESSAGE.CALENDAR_UPDATED_SUCCESSFULLY)
    } catch {
      showToast("error", MESSAGE.CALENDAR_SAVE_FAILED)
    }
  }

  const deleteCalendar = async (id: string) => {
    try {
      await remove(id)
      showToast("success", MESSAGE.CALENDAR_DELETED_SUCCESSFULLY)
    } catch {
      showToast("error", MESSAGE.CALENDAR_DELETE_FAILED)
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
