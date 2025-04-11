import { useEffect, useState } from 'react';
import { Category } from '../types';

const URL = '/category';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch(URL);
      const data = await res.json();
      setCategories(data);
    } catch {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (category: Omit<Category, 'id'>) => {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (res.ok) fetchCategories();
  };

  const updateCategory = async (category: Category) => {
    const res = await fetch(`${URL}/${category.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (res.ok) fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    const res = await fetch(`${URL}/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}
