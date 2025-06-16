import { createCrudRepository } from "@/features/crud/crud.repository"

import type { Category } from "@/features/category/category.model"

export function useCategoryRepository() {
  return createCrudRepository<Category>("categories")
}
