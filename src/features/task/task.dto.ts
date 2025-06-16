import type { TaskStatus } from "@/features/task/taskStatus.type"

export interface TaskDto {
  id?: string
  name: string
  description?: string
  status: TaskStatus
  calendarId?: string
  categoryId?: string
}
