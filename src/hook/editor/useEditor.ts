import EditorData from "@/type/editor/editorData"
import EditorMode from "@/type/editor/editorMode"
import EditorType from "@/type/editor/editorType"

import { useState } from "react"

const useEditor = () => {
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorType, setEditorType] = useState<EditorType>(EditorType.CALENDAR)
  const [editorMode, setEditorMode] = useState<EditorMode>(EditorMode.ADD)
  const [editorData, setEditorData] = useState<EditorData>({
    label: "",
    emoji: "📅"
  })

  const openEditor = (
    type: EditorType,
    mode: EditorMode,
    data: EditorData = { label: "", emoji: "📅" }
  ) => {
    setEditorType(type)
    setEditorMode(mode)
    setEditorData(data)
    setEditorOpen(true)
  }

  const closeEditor = () => setEditorOpen(false)

  return {
    selectedCalendar,
    setSelectedCalendar,
    selectedCategory,
    setSelectedCategory,

    editorOpen,
    editorType,
    editorMode,
    editorData,
    openEditor,
    closeEditor
  }
}

export default useEditor
