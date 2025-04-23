import Category from "../domain/category"
import CategoryDto from "../dto/categoryDto"

export const toCategory = (dto: CategoryDto): Category => ({
  id: dto.id ?? "",
  name: dto.name,
  color: dto.color
})

export const toCategoryDto = (category: Category): CategoryDto => ({
  id: category.id,
  name: category.name,
  color: category.color
})
