import { createCrudService } from "@/features/crud/crud.service"

import { useStorage } from "@/storage/useStorage.hook"

import { useTaskController } from "@/features/task/task.controller"
import { useTaskRepository } from "@/features/task/task.repository"
import type { Task } from "@/features/task/task.model"
import type { TaskDto } from "@/features/task/task.dto"
import { taskToDto, dtoToTask } from "@/features/task/task.mapper"
import { validateTask } from "@/features/task/task.validation"

export function useTaskService() {
  const controller = useTaskController()
  const repository = useTaskRepository()
  const { calendars, categories } = useStorage()

  return createCrudService<Task, TaskDto, TaskDto>(
    controller,
    repository,
    taskToDto,
    (dto) => dtoToTask(dto, calendars, categories),
    validateTask
  )
}
