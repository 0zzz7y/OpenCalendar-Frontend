import type TaskDto from "@/model/dto/task.dto"
import { createCrudService } from "./crud.service"

export const {
  getAll: getTasks,
  create: createTask,
  update: updateTask,
  delete: deleteTask
} = createCrudService<TaskDto>(`${import.meta.env.VITE_API_URL}/tasks`)
