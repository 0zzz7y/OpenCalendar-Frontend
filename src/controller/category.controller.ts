import useAppStore from "@/store/useAppStore"
import * as categoryService from "@/service/category.service"
import type Category from "@/model/domain/category"

export const loadCategories = async () => {
  const categories = await categoryService.getCategories()
  useAppStore.getState().setCategories(categories)
}

export const addCategory = async (category: { name: string; emoji?: string; color?: string }) => {
  const created = await categoryService.createCategory(category)
  useAppStore.getState().setCategories([...useAppStore.getState().categories, created])
}

export const updateCategory = async (category: Category) => {
  const updated = await categoryService.updateCategory(category.id, category)
  useAppStore.getState().setCategories(
    useAppStore.getState().categories.map((c) => (c.id === updated.id ? updated : c))
  )
}

export const deleteCategory = async (id: string) => {
  await categoryService.deleteCategory(id)
  useAppStore.getState().setCategories(
    useAppStore.getState().categories.filter((c) => c.id !== id)
  )
}
