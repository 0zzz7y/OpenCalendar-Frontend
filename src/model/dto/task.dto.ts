import type RecurringPattern from "@/model/domain/recurringPattern"
import type TaskStatus from "@/model/domain/taskStatus"

interface TaskDto {
  id?: string
  title: string
  description?: string
  status: TaskStatus
  calendarId?: string
  categoryId?: string
}

export default TaskDto
