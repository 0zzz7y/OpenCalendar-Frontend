import RecurringPattern from "./recurringPattern"

interface Event {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  recurringPattern?: RecurringPattern
  calendarId: string
  categoryId?: string
}

export default Event
