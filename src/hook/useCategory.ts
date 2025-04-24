import { useCallback } from "react"
import {
  getCategories,
  createCategory,
  updateCategory as serviceUpdate,
  deleteCategory as serviceDelete
} from "@/service/category.service"
import useAppStore from "@/store/useAppStore"
import type Category from "@/model/domain/category"

const useCategory = () => {
  const { categories, setCategories } = useAppStore()

  const reloadCategories = useCallback(async () => {
    const data = await getCategories()
    setCategories(data)
  }, [setCategories])

  const addCategory = useCallback(async (category: Partial<Category>) => {
    const created = await createCategory(category as Category)
    setCategories([...categories, created])
    return created
  }, [categories, setCategories])

  const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    const updated = await serviceUpdate(id, updates)
    setCategories(categories.map((c) => (c.id === id ? updated : c)))
    return updated
  }, [categories, setCategories])

  const deleteCategory = useCallback(async (id: string) => {
    await serviceDelete(id)
    setCategories(categories.filter((c) => c.id !== id))
  }, [categories, setCategories])

  return {
    reloadCategories,
    addCategory,
    updateCategory,
    deleteCategory
  }
}

export default useCategory
