import TaskStatus from "./taskStatus"
import RecurringPattern from "./recurringPattern"

export default interface Task {
  id: string
  name: string
  description?: string
  startDate?: string
  endDate?: string
  recurringPattern?: RecurringPattern
  status: TaskStatus
  calendarId?: string
  categoryId?: string
}
