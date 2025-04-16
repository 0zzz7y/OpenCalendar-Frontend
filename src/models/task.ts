import { TaskStatus } from "./taskStatus"
import { RecurringPattern } from "./recurringPattern"

export interface Task {
  id: string
  title: string
  description?: string
  startDate?: string
  endDate?: string
  status: TaskStatus
  calendarId?: string
  categoryId?: string
  recurringPattern?: RecurringPattern
}
