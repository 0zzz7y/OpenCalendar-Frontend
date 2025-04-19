import { useState, useEffect } from "react"

const useFilters = () => {
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>("all")
  const [selectedCategory, setSelectedCategory] = useState<string | null>("all")

  useEffect(() => {
    if (selectedCalendar === null) {
      setSelectedCalendar("all")
    }
  }, [selectedCalendar])

  useEffect(() => {
    if (selectedCategory === null) {
      setSelectedCategory("all")
    }
  }, [selectedCategory])

  return {
    selectedCalendar,
    setSelectedCalendar,
    selectedCategory,
    setSelectedCategory
  }
}

export default useFilters
