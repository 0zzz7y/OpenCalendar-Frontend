import * as taskService from "@/service/task.service"
import { dtoToTask, taskToDto } from "@/model/mapper/task.mapper"
import { createCrudController } from "./crud.controller"
import useApplicationStorage from "@/storage/useApplicationStorage"

export const {
  load: loadTasks,
  add: addTask,
  update: updateTask,
  remove: deleteTask
} = createCrudController(
  "tasks",
  {
    getAll: taskService.getTasks,
    create: taskService.createTask,
    update: taskService.updateTask,
    delete: taskService.deleteTask
  },
  {
    toDto: taskToDto,
    fromDto: (dto) =>
      dtoToTask(dto, useApplicationStorage.getState().calendars, useApplicationStorage.getState().categories)
  }
)
