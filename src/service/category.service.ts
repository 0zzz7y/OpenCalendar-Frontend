import type CategoryDto from "@/model/dto/category.dto"
import { createCrudService } from "./crud.service"

const serviceUrl = import.meta.env.VITE_API_URL || "http://localhost:8080"

export const {
  getAll: getCategories,
  create: createCategory,
  update: updateCategory,
  delete: deleteCategory
} = createCrudService<CategoryDto>(`${serviceUrl}/categories`)
