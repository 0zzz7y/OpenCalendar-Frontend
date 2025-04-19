import Category from "@/type/category"

export interface CategoryEditorData {
  id?: string
  label: string
  color: string
}

export default interface CategoryContextState {
  categories: Category[]
  selectedCategory: string | null
  setSelectedCategory: (val: string | null) => void

  editorOpen: boolean
  editorMode: "add" | "edit" | "delete"
  editorData: CategoryEditorData
  openEditor: (
    mode: "add" | "edit" | "delete",
    data?: CategoryEditorData
  ) => void
  closeEditor: () => void

  reloadCategories: () => Promise<void>
}
