import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Category from "../types/category";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>(`${import.meta.env.VITE_BACKEND_URL}/categories`);
      console.log("Categories fetched:", response.data);
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const addCategory = async (category: Omit<Category, "id">) => {
    try {
      const response = await axios.post<Category>(`${import.meta.env.VITE_BACKEND_URL}/categories`, category);
      console.log("Category added:", response.data);
      setCategories((prev) => [...prev, response.data]);
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      const response = await axios.put<Category>(`${import.meta.env.VITE_BACKEND_URL}/categories/${id}`, category);
      console.log("Category updated:", response.data);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? response.data : cat))
      );
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/categories/${id}`);
      console.log("Category deleted:", id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return {
    categories,
    setCategories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };
};

export default useCategories;
