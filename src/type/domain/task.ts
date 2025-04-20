import TaskStatus from "./taskStatus"
import RecurringPattern from "./recurringPattern"

interface Task {
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

export default Task
