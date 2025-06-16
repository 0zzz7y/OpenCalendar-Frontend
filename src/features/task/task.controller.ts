import { createCrudController } from "@/features/crud/crud.controller"

import { useApiUrl } from "@/utilities/api.utility"

import type { TaskDto } from "@/features/task/task.dto"

export function useTaskController() {
  const apiUrl = useApiUrl()
  return createCrudController<TaskDto>(`${apiUrl}/api/v1/tasks`)
}
