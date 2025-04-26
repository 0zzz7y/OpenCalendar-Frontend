import {
  getCategories,
  createCategory,
  updateCategory as serviceUpdateCategory,
  deleteCategory as serviceDeleteCategory
} from "@/service/category.service"
import { categoryToDto, dtoToCategory } from "@/model/mapper/category.mapper"
import type Category from "@/model/domain/category"
import type CategoryDto from "@/model/dto/category.dto"
import { createUseCrud } from "@/repository/crud.repository"
import { showToast } from "@/component/toast/Toast"
import MESSAGE from "@/constant/ui/message"

const validateCategory = (category: Partial<Category>) => {
  if (!category.name || category.name.trim() === "") {
    throw new Error("Category name is required.")
  }
}

const useCrudCategory = createUseCrud<Category, CategoryDto, CategoryDto>(
  "categories",
  {
    getAll: getCategories,
    create: createCategory,
    update: serviceUpdateCategory,
    delete: serviceDeleteCategory
  },
  categoryToDto,
  dtoToCategory,
  validateCategory
)

export function useCategory() {
  const { reload, add, update, remove } = useCrudCategory()

  const addCategory = async (data: Partial<Category>): Promise<Category> => {
    try {
      const savedCategory = await add(data)
      showToast("success", MESSAGE.CATEGORY_CREATED_SUCCESSFULLY)
      return savedCategory
    } catch {
      showToast("error", MESSAGE.CATEGORY_CREATE_FAILED)
      throw new Error(MESSAGE.CATEGORY_CREATE_FAILED)
    }
  }

  const updateCategory = async (data: Partial<Category> & { id: string }): Promise<Category> => {
    try {
      const updatedCategory = await update(data)
      showToast("success", MESSAGE.CATEGORY_UPDATED_SUCCESSFULLY)
      return updatedCategory
    } catch {
      showToast("error", MESSAGE.CATEGORY_CREATE_FAILED)
      throw new Error(MESSAGE.CATEGORY_CREATE_FAILED)
    }
  }

  const deleteCategory = async (id: string): Promise<void> => {
    try {
      await remove(id)
      showToast("success", MESSAGE.CATEGORY_DELETED_SUCCESSFULLY)
    } catch {
      showToast("error", MESSAGE.CATEGORY_DELETE_FAILED)
      throw new Error(MESSAGE.CATEGORY_DELETE_FAILED)
    }
  }

  return {
    reloadCategories: reload,
    addCategory,
    updateCategory,
    deleteCategory
  }
}

export default useCategory
