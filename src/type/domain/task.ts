import TaskStatus from "./taskStatus"
import RecurringPattern from "./recurringPattern"
import Calendar from "./calendar"
import Category from "./category"

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
