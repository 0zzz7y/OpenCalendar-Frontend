import { useContext } from "react"
import NoteContext from "../../context/NoteContext"

const useNoteContext = () => {
  const context = useContext(NoteContext)
  if (!context) {
    throw new Error("useNoteContext must be used within a NoteProvider.")
  }
  return context
}

export default useNoteContext
