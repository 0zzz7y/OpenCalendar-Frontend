import { useState, useCallback, useEffect } from "react";
import axios from "axios";

import Category from "../types/category";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get<Category[]>("/categories");
      setCategories(response.data ?? []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    setCategories,
    fetchCategories
  };
};

export default useCategories;
