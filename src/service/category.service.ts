/**
 * Copyright (c) Tomasz Wnuk
 */

import type CategoryDto from "@/model/dto/category.dto"
import { createCrudService } from "./crud.service"
import getServiceUrl from "@/utilities/getServiceUrl"

const serviceUrl = getServiceUrl("categories")

export const {
  getAll: getCategories,
  create: createCategory,
  update: updateCategory,
  delete: deleteCategory
} = createCrudService<CategoryDto>(`${serviceUrl}/categories`)
