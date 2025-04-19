import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

import Category from "../types/category"

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const fetchCategories = async (pageNumber = 0, reset = false) => {
    try {
      const response = await axios.get<PaginatedResponse<Category>>(
        `${import.meta.env.VITE_BACKEND_URL}/categories`,
        { params: { page: pageNumber, size } }
      )

      const data = response.data

      setCategories((prev) =>
        reset ? data.content : [...prev, ...data.content]
      )
      setPage(data.number)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch (error) {
      toast.error("Failed to fetch categories")
    }
  }

  const reloadCategories = async () => {
    try {
      let allCategories: Category[] = []
      let currentPage = 0
      let total = 1

      do {
        const response = await axios.get<PaginatedResponse<Category>>(
          `${import.meta.env.VITE_BACKEND_URL}/categories`,
          { params: { page: currentPage, size } }
        )

        const data = response.data
        allCategories = [...allCategories, ...data.content]
        total = data.totalPages
        currentPage++
      } while (currentPage < total)

      setCategories(allCategories)
      setPage(0)
      setTotalPages(1)
      setTotalElements(allCategories.length)
    } catch (error) {
      toast.error("Failed to reload all categories")
    }
  }

  const loadNextPage = async () => {
    if (page + 1 >= totalPages) return
    setIsLoadingMore(true)
    await fetchCategories(page + 1)
    setIsLoadingMore(false)
  }

  const addCategory = async (category: Omit<Category, "id">): Promise<Category> => {
    if (!category.name.trim()) {
      throw new Error("Category name cannot be empty.")
    }

    const temporaryId = crypto.randomUUID()
    const optimisticCategory: Category = { ...category, id: temporaryId }
    setCategories((prev) => [...prev, optimisticCategory])

    try {
      const response = await axios.post<Category>(
        `${import.meta.env.VITE_BACKEND_URL}/categories`,
        category
      )
      const savedCategory = response.data
      setCategories((prev) =>
        prev.map((c) => (c.id === temporaryId ? { ...savedCategory } : c))
      )
      return savedCategory
    } catch (error) {
      toast.error("Failed to add category")
      setCategories((prev) => prev.filter((c) => c.id !== temporaryId))
      throw error
    }
  }

  const updateCategory = async (id: string, updated: Partial<Category>) => {
    const previous = categories.find((c) => c.id === id)
    if (!previous) return

    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    )

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/categories/${id}`,
        updated
      )
    } catch (error) {
      toast.error("Failed to update category")
      setCategories((prev) => prev.map((c) => (c.id === id ? previous : c)))
      throw error
    }
  }

  const deleteCategory = async (id: string) => {
    const deleted = categories.find((c) => c.id === id)
    if (!deleted) return

    setCategories((prev) => prev.filter((c) => c.id !== id))

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/categories/${id}`)
    } catch (error) {
      toast.error("Failed to delete category")
      setCategories((prev) => [...prev, deleted])
      throw error
    }
  }

  useEffect(() => {
    reloadCategories()
  }, [])

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    reloadCategories,
    loadNextPage,
    page,
    size,
    totalPages,
    totalElements,
    isLoadingMore
  }
}

export default useCategories
