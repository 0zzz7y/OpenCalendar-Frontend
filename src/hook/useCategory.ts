import { useCallback } from "react"
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/service/category.service"
import useAppStore from "@/store/useAppStore"
import type Category from "@/model/domain/category"

const useCategory = () => {
  const setCategories = useAppStore((state: { setCategories: (categories: Category[]) => void }) => state.setCategories)

  const reloadCategories = useCallback(async () => {
    const data = await getCategories()
    setCategories(data)
  }, [setCategories])

  const addCategory = useCallback(async (category: { name: string; emoji?: string; color?: string }) => {
    return await createCategory(category)
  }, [])

  const updateCategoryById = useCallback(async (id: string, updates: Partial<Category>) => {
    return await updateCategory(id, updates)
  }, [])

  const deleteCategoryById = useCallback(async (id: string) => {
    return await deleteCategory(id)
  }, [])

  return {
    reloadCategories,
    addCategory,
    updateCategory: updateCategoryById,
    deleteCategory: deleteCategoryById
  }
}

export default useCategory
