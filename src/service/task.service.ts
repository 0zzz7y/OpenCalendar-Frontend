import type TaskDto from "@/model/dto/task.dto"
import { createCrudService } from "./crud.service"

const serviceUrl = import.meta.env.VITE_API_URL || "http://localhost:8080"

export const {
  getAll: getTasks,
  create: createTask,
  update: updateTask,
  delete: deleteTask
} = createCrudService<TaskDto>(`${serviceUrl}/api/v1/tasks`)
