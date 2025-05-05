/**
 * Copyright (c) Tomasz Wnuk
 */

import type TaskDto from "@/model/dto/task.dto"
import { createCrudService } from "./crud.service"
import getServiceUrl from "@/utilities/getServiceUrl"

const serviceUrl = getServiceUrl("tasks")

export const {
  getAll: getTasks,
  create: createTask,
  update: updateTask,
  delete: deleteTask
} = createCrudService<TaskDto>(`${serviceUrl}/tasks`)
