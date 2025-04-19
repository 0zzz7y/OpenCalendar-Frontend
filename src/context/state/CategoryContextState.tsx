import Category from "@/type/domain/category"
import EditorMode from "@/type/utility/editorMode"

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
  editorMode: EditorMode
  editorData: CategoryEditorData
  openEditor: (
    mode: EditorMode,
    data?: CategoryEditorData
  ) => void
  closeEditor: () => void

  reloadCategories: () => Promise<void>
}
