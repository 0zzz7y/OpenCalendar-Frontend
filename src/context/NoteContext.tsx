import { createContext, useState, ReactNode } from "react"

import NoteContextState, { NoteEditorData } from "./state/NoteContextState"

import useNote from "@/hook/api/useNote"

import EditorMode from "@/type/utility/editorMode"

const NoteContext = createContext<NoteContextState | undefined>(undefined)

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorMode, setEditorMode] = useState<EditorMode>("add")
  const [editorData, setEditorData] = useState<NoteEditorData>({
    name: "",
    description: "",
    calendarId: "",
    categoryId: ""
  })

  const { notes, reloadNotes } = useNote()

  const openEditor = (
    mode: EditorMode,
    data: NoteEditorData = {
      name: "",
      description: "",
      calendarId: "",
      categoryId: ""
    }
  ) => {
    setEditorMode(mode)
    setEditorData(data)
    setEditorOpen(true)
  }

  const closeEditor = () => setEditorOpen(false)

  return (
    <NoteContext.Provider
      value={{
        notes,
        reloadNotes,
        editorOpen,
        editorMode,
        editorData,
        openEditor,
        closeEditor
      }}
    >
      {children}
    </NoteContext.Provider>
  )
}

export default NoteContext
