import TaskDto from "../dto/taskDto"
import Task from "../domain/task"
import Calendar from "../domain/calendar"
import Category from "../domain/category"
import RecurringPattern from "../domain/recurringPattern"

export const toTask = (
  dto: TaskDto,
  calendar: Calendar,
  category?: Category
): Task => ({
  id: dto.id ?? "",
  name: dto.name,
  description: dto.description,
  startDate: dto.startDate,
  endDate: dto.endDate,
  recurringPattern: dto.recurringPattern as RecurringPattern,
  status: dto.status,
  calendar,
  category
})

export const toTaskDto = (task: Task): TaskDto => ({
  id: task.id,
  name: task.name,
  description: task.description,
  startDate: task.startDate,
  endDate: task.endDate,
  recurringPattern: task.recurringPattern,
  status: task.status,
  calendarId: task.calendar?.id,
  categoryId: task.category?.id
})
