import RecurringPattern from "@/model/domain/recurringPattern"
import TaskStatus from "@/model/domain/taskStatus"

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
