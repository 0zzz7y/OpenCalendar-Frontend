import type { RecurringPattern } from "@/features/event/recurringPattern.type"

export interface EventDto {
  id?: string
  name: string
  description?: string
  startDate: string
  endDate: string
  recurringPattern: RecurringPattern
  calendarId: string
  categoryId?: string
}
