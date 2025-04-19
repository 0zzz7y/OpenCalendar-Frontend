import { createContext, useState, ReactNode } from "react"

import useCategories from "../hook/api/useCategory"
import CategoryContextState, {
  CategoryEditorData
} from "./state/CategoryContextState"

const CategoryContext = createContext<CategoryContextState | undefined>(
  undefined
)

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>("all")
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorMode, setEditorMode] = useState<"add" | "edit" | "delete">("add")
  const [editorData, setEditorData] = useState<CategoryEditorData>({
    label: "",
    color: "#3b5bdb"
  })

  const { categories, reloadCategories } = useCategories()

  const openEditor = (
    mode: "add" | "edit" | "delete",
    data: CategoryEditorData = { label: "", color: "#3b5bdb" }
  ) => {
    setEditorMode(mode)
    setEditorData(data)
    setEditorOpen(true)
  }

  const closeEditor = () => setEditorOpen(false)

  return (
    <CategoryContext.Provider
      value={{
        categories,
        selectedCategory,
        setSelectedCategory,
        editorOpen,
        editorMode,
        editorData,
        openEditor,
        closeEditor,
        reloadCategories
      }}
    >
      {children}
    </CategoryContext.Provider>
  )
}

export default CategoryContext
