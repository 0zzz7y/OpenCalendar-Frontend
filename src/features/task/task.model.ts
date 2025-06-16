import type { TaskStatus } from "@/features/task/taskStatus.type"
import type { Calendar } from "@/features/calendar/calendar.model"
import type { Category } from "@/features/category/category.model"

export interface Task {
  id: string
  name: string
  description?: string
  status: TaskStatus
  calendar: Calendar
  category?: Category
}
