import type Category from "@/model/domain/category"
import axios from "axios"

const base = "/category"

export const getCategories = async (): Promise<Category[]> => {
  const result = await axios.get(base)
  return result.data
}

export const createCategory = async (category: { name: string; emoji?: string; color?: string }): Promise<Category> => {
  const result = await axios.post(base, category)
  return result.data
}

export const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category> => {
  const result = await axios.put(`${base}/${id}`, updates)
  return result.data
}

export const deleteCategory = async (id: string): Promise<void> => {
  await axios.delete(`${base}/${id}`)
}
