/**
 * Copyright (c) Tomasz Wnuk
 */

import type Category from "@/model/domain/category"
import type CategoryDto from "@/model/dto/category.dto"

export function dtoToCategory(dto: CategoryDto): Category {
  return {
    id: dto.id ?? "",
    title: dto.title,
    color: dto.color
  }
}

export function categoryToDto(category: Partial<Category>): CategoryDto {
  return {
    id: category.id,
    title: category.title ?? "",
    color: category.color ?? ""
  }
}
