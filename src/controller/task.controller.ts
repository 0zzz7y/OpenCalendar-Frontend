import * as taskService from "@/service/task.service";
import { dtoToTask, taskToDto } from "@/model/mapper/task.mapper";
import { createCrudController } from "./crud.controller";
import useAppStore from "@/store/useAppStore";

export const {
  load:   loadTasks,
  add:    addTask,
  update: updateTask,
  remove: deleteTask,
} = createCrudController(
  "tasks",
  {
    getAll: taskService.getTasks,
    create: taskService.createTask,
    update: taskService.updateTask,
    delete: taskService.deleteTask,
  },
  {
    toDto:   taskToDto,
    fromDto: (dto) =>
      dtoToTask(
        dto,
        useAppStore.getState().calendars,
        useAppStore.getState().categories
      ),
  }
);
