import { useEffect, useState } from "react"
import axios from "../api/axios"
import { Category } from "../types/category"

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])

  const fetchCategories = async () => {
    const response = await axios.get<Category[]>("/categories")
    setCategories(response.data)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return { categories, setCategories, fetchCategories }
}
