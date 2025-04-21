import Calendar from "./calendar"
import Category from "./category"
import RecurringPattern from "./recurringPattern"
import TaskStatus from "./taskStatus"

interface Task {
  id: string
  name: string
  description?: string
  startDate?: string
  endDate?: string
  recurringPattern: RecurringPattern
  status: TaskStatus
  calendar: Calendar
  category?: Category
}

export default Task
