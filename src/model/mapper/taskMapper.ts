import Calendar from "../domain/calendar"
import Category from "../domain/category"
import RecurringPattern from "../domain/recurringPattern"
import Task from "../domain/task"
import TaskStatus from "../domain/taskStatus"
import TaskDto from "../dto/taskDto"

export const toTaskDto = (task: Partial<Task>): TaskDto => ({
  id: task.id,
  name: task.name ?? "",
  description: task.description,
  startDate: task.startDate,
  endDate: task.endDate,
  recurringPattern: task.recurringPattern ?? RecurringPattern.NONE,
  status: task.status ?? TaskStatus.TODO,
  calendarId: task.calendar?.id,
  categoryId: task.category?.id
})

export const fromTaskDto = (dto: TaskDto, calendarMap: Map<string, Calendar>, categoryMap: Map<string, Category>): Task => ({
  id: dto.id ?? "",
  name: dto.name,
  description: dto.description,
  startDate: dto.startDate,
  endDate: dto.endDate,
  recurringPattern: dto.recurringPattern ?? RecurringPattern.NONE,
  status: dto.status ?? TaskStatus.TODO,
  calendar: calendarMap.get(dto.calendarId ?? "")!,
  category: categoryMap.get(dto.categoryId ?? "")
})
