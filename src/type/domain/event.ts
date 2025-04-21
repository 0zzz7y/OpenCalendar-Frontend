import Calendar from "./calendar"
import Category from "./category"
import RecurringPattern from "./recurringPattern"

interface Event {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  recurringPattern: RecurringPattern
  calendar: Calendar
  category?: Category
}

export default Event
