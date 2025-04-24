import type Category from "@/model/domain/category"
import type CategoryDto from "@/model/dto/category.dto"

export function dtoToCategory(dto: CategoryDto): Category {
  return {
    id: dto.id ?? "",
    name: dto.name,
    color: dto.color
  }
}

export function categoryToDto(category: Partial<Category>): CategoryDto {
  return {
    id: category.id,
    name: category.name ?? "",
    color: category.color ?? ""
  }
}
