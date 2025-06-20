import { createCrudService } from "@/features/crud/crud.service"

import { useCategoryController } from "@/features/category/category.controller"
import { useCategoryRepository } from "@/features/category/category.repository"
import type { Category } from "@/features/category/category.model"
import type { CategoryDto } from "@/features/category/category.dto"
import { categoryToDto, dtoToCategory } from "@/features/category/category.mapper"
import { validateCategory } from "@/features/category/category.validation"

export function useCategoryService() {
  const controller = useCategoryController()
  const repository = useCategoryRepository()

  return createCrudService<Category, CategoryDto, CategoryDto>(
    controller,
    repository,
    categoryToDto,
    dtoToCategory,
    validateCategory
  )
}
