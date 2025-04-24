import type RecurringPattern from "@/model/domain/recurringPattern"

interface EventDto {
  id?: string
  name: string
  description?: string
  startDate: string
  endDate: string
  recurringPattern: RecurringPattern
  calendarId: string
  categoryId?: string
}

export default EventDto
