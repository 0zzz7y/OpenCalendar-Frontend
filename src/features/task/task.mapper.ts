import type { Task } from "@/features/task/task.model"
import type { TaskDto } from "@/features/task/task.dto"
import { TaskStatus } from "@/features/task/taskStatus.type"
import type { Calendar } from "@/features/calendar/calendar.model"
import type { Category } from "@/features/category/category.model"

export function dtoToTask(dto: TaskDto, calendars: Calendar[], categories: Category[]): Task {
  return {
    id: dto.id || "",
    name: dto.name || "",
    description: dto.description || "",
    status: dto.status || TaskStatus.TODO,
    calendar: calendars.find((c) => c.id === dto.calendarId) as Calendar,
    category: categories.find((c) => c.id === dto.categoryId) as Category
  }
}

export function taskToDto(task: Partial<Task>): TaskDto {
  return {
    id: task.id || "",
    name: task.name || "",
    description: task.description || "",
    status: task.status || TaskStatus.TODO,
    calendarId: task.calendar?.id || "",
    categoryId: task.category?.id || ""
  }
}
