/**
 * Copyright (c) Tomasz Wnuk
 */

import * as categoryService from "@/service/category.service"
import { dtoToCategory, categoryToDto } from "@/model/mapper/category.mapper"
import { createCrudController } from "./crud.controller"

export const {
  load: loadCategories,
  add: addCategory,
  update: updateCategory,
  remove: deleteCategory
} = createCrudController(
  "categories",
  {
    getAll: categoryService.getCategories,
    create: categoryService.createCategory,
    update: categoryService.updateCategory,
    delete: categoryService.deleteCategory
  },
  {
    toDto: categoryToDto,
    fromDto: dtoToCategory
  }
)
