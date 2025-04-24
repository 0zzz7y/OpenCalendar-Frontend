import Calendar from "@/model/domain/calendar"
import Category from "@/model/domain/category"
import RecurringPattern from "@/model/domain/recurringPattern"
import Task from "@/model/domain/task"
import TaskStatus from "@/model/domain/taskStatus"
import TaskDto from "@/model/dto/task.dto"

export const dtoToTask = (dto: TaskDto, calendars: Calendar[], categories: Category[]): Task => ({
  id: dto.id ?? "",
  name: dto.name,
  description: dto.description,
  startDate: dto.startDate,
  endDate: dto.endDate,
  recurringPattern: dto.recurringPattern ?? RecurringPattern.NONE,
  status: dto.status ?? TaskStatus.TODO,
  calendar: calendars.find((c) => c.id === dto.calendarId)! || "",
  category: categories.find((c) => c.id === dto.categoryId)! || ""
})

export const taskToDto = (task: Partial<Task>): TaskDto => ({
  id: task.id,
  name: task.name ?? "",
  description: task.description,
  startDate: task.startDate,
  endDate: task.endDate,
  recurringPattern: task.recurringPattern ?? RecurringPattern.NONE,
  status: task.status ?? TaskStatus.TODO,
  calendarId: task.calendar?.id || "",
  categoryId: task.category?.id || ""
})
