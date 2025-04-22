import Calendar from "./calendar"
import Category from "./category"
import Schedulable from "./schedulable"
import TaskStatus from "./taskStatus"

interface Task extends Schedulable {
  id: string
  name: string
  description?: string
  startDate?: string
  endDate?: string
  status: TaskStatus
  calendar: Calendar
  category?: Category
}

export default Task
