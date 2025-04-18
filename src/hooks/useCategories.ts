import { useEffect, useState } from "react"
import axios from "../api/axios"
import Category from "../types/category"

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>("/categories")
      setCategories(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return { categories, setCategories, fetchCategories }
}
