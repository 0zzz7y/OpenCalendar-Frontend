import { useEffect, useState } from "react"
import axios from "../api/axios"
import Note from "../types/note"

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([])

  const fetchNotes = async () => {
    try {
      const response = await axios.get<Note[]>("/notes")
      setNotes(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error("Failed to fetch notes:", error)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return { notes, setNotes, fetchNotes }
}
