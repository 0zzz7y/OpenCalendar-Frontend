import { useContext } from "react"
import CategoryContext from "@/context/CategoryContext"

const useCategoryContext = () => {
  const context = useContext(CategoryContext)
  if (!context) throw new Error("useCategoryContext must be used within a CategoryProvider.")
  return context
}

export default useCategoryContext
