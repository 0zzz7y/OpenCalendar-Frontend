import type TaskStatus from "@/model/domain/taskStatus"

interface TaskDto {
  id?: string
  name: string
  description?: string
  status: TaskStatus
  calendarId?: string
  categoryId?: string
}

export default TaskDto
