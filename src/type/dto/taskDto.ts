import TaskStatus from "../domain/taskStatus"
import RecurringPattern from "../domain/recurringPattern"

interface TaskDto {
  id?: string
  name: string
  description?: string
  startDate?: string
  endDate?: string
  recurringPattern?: RecurringPattern
  status: TaskStatus
  calendarId?: string
  categoryId?: string
}

export default TaskDto
