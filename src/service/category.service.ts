import type CategoryDto from "@/model/dto/category.dto"
import { createCrudService } from "./crud.service"

export const {
  getAll: getCategories,
  create: createCategory,
  update: updateCategory,
  delete: deleteCategory
} = createCrudService<CategoryDto>(`${import.meta.env.VITE_BASE_URL}/categories`)
