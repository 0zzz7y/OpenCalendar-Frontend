import { createCrudController } from "@/features/crud/crud.controller"

import { useApiUrl } from "@/utilities/api.utility"

import type { CategoryDto } from "@/features/category/category.dto"

export function useCategoryController() {
  const apiUrl = useApiUrl()
  return createCrudController<CategoryDto>(`${apiUrl}/api/v1/categories`)
}
