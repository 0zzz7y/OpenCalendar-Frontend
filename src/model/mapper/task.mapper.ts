import type Task from "@/model/domain/task"
import type TaskDto from "@/model/dto/task.dto"
import type Calendar from "@/model/domain/calendar"
import type Category from "@/model/domain/category"
import RecurringPattern from "@/model/domain/recurringPattern"
import TaskStatus from "../domain/taskStatus"

export function dtoToTask(dto: TaskDto, calendars: Calendar[], categories: Category[]): Task {
  return {
    id: dto.id ?? "",
    name: dto.name,
    description: dto.description,
    startDate: dto.startDate,
    endDate: dto.endDate,
    recurringPattern: dto.recurringPattern ?? RecurringPattern.NONE,
    status: dto.status,
    calendar: calendars.find((c) => c.id === dto.calendarId) as Calendar,
    category: categories.find((c) => c.id === dto.categoryId)
  }
}

export function taskToDto(task: Partial<Task>): TaskDto {
  return {
    id: task.id,
    name: task.name ?? "",
    description: task.description,
    startDate: task.startDate,
    endDate: task.endDate,
    recurringPattern: task.recurringPattern,
    status: task.status ?? TaskStatus.TODO,
    calendarId: task.calendar?.id,
    categoryId: task.category?.id
  }
}
