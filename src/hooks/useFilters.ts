import { create } from "zustand";

interface FiltersState {
  selectedCalendar: string | null;
  selectedCategory: string | null;
  setSelectedCalendar: (id: string | null) => void;
  setSelectedCategory: (id: string | null) => void;
}

const useFilters = create<FiltersState>((set) => ({
  selectedCalendar: "all",
  selectedCategory: "all",
  setSelectedCalendar: (id) => set({ selectedCalendar: id }),
  setSelectedCategory: (id) => set({ selectedCategory: id })
}));

export default useFilters;
