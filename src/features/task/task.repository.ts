import { createCrudRepository } from "@/features/crud/crud.repository"

import type { Task } from "@/features/task/task.model"

export function useTaskRepository() {
  return createCrudRepository<Task>("tasks")
}
