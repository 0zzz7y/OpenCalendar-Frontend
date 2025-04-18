import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Category from "../types/category";

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchCategories = async (pageNumber = 0, reset = false) => {
    try {
      const response = await axios.get<PaginatedResponse<Category>>(
        `${import.meta.env.VITE_BACKEND_URL}/categories`,
        { params: { page: pageNumber, size } }
      );

      const data = response.data;

      setCategories((prev) => reset ? data.content : [...prev, ...data.content]);
      setPage(data.number);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const reloadCategories = async () => {
    try {
      let allCategories: Category[] = [];
      let currentPage = 0;
      let total = 1;

      do {
        const response = await axios.get<PaginatedResponse<Category>>(
          `${import.meta.env.VITE_BACKEND_URL}/categories`,
          { params: { page: currentPage, size } }
        );

        const data = response.data;
        allCategories = [...allCategories, ...data.content];
        total = data.totalPages;
        currentPage++;
      } while (currentPage < total);

      setCategories(allCategories);
      setPage(0);
      setTotalPages(1);
      setTotalElements(allCategories.length);
    } catch (error) {
      toast.error("Failed to reload all categories");
    }
  };

  const loadNextPage = async () => {
    if (page + 1 >= totalPages) return;
    setIsLoadingMore(true);
    await fetchCategories(page + 1);
    setIsLoadingMore(false);
  };

  const addCategory = async (category: Omit<Category, "id">) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/categories`, category);
      await reloadCategories();
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/categories/${id}`, category);
      await reloadCategories();
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/categories/${id}`);
      await reloadCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  useEffect(() => {
    reloadCategories();
  }, []);

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
  };
};

export default useCategories;
