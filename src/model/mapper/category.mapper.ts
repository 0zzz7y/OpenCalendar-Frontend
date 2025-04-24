import type Category from "@/model/domain/category"
import type CategoryDto from "@/model/dto/category.dto"

export const dtoToCategory = (dto: CategoryDto): Category => ({
  id: dto.id || "",
  name: dto.name || "",
  color: dto.color || "#ffffff"
})

export const categoryToDto = (category: Partial<Category>): CategoryDto => ({
  id: category.id || "",
  name: category.name || "",
  color: category.color || "#ffffff"
})
