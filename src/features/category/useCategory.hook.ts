import { useCategoryService } from "@/features/category/category.service"

export function useCategory() {
  const { reload, add, update, remove } = useCategoryService()

  return {
    reloadCategories: reload,
    addCategory: add,
    updateCategory: update,
    deleteCategory: remove
  }
}
