import type Calendar from "./calendar"
import type Category from "./category"
import type RecurringPattern from "./recurringPattern"

interface Schedulable {
  id: string
  name?: string
  description?: string
  startDate?: string
  endDate?: string
  recurringPattern: RecurringPattern
  calendar: Calendar
  category?: Category
}

export default Schedulable
