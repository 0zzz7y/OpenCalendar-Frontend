import {
  getCategories,
  createCategory,
  updateCategory as serviceUpdateCategory,
  deleteCategory as serviceDeleteCategory
} from "@/service/category.service";
import { categoryToDto, dtoToCategory } from "@/model/mapper/category.mapper";
import type Category from "@/model/domain/category";
import type CategoryDto from "@/model/dto/category.dto";
import { createUseCrud } from "@/repository/crud.repository";

const useCrudCategory = createUseCrud<Category, CategoryDto, CategoryDto>(
  "categories",
  {
    getAll: getCategories,
    create: createCategory,
    update: serviceUpdateCategory,
    delete: serviceDeleteCategory
  },
  categoryToDto,
  dtoToCategory
);

function useCategory() {
  const { reload, add, update, remove } = useCrudCategory();
  return {
    reloadCategories: reload,
    addCategory: add,
    updateCategory: update,
    deleteCategory: remove
  };
}

export default useCategory
