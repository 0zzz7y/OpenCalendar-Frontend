import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

import Note from "@/type/domain/note"

const useNote = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const fetchNotes = async (pageNumber = 0, reset = false) => {
    try {
      const response = await axios.get<PaginatedResponse<Note>>(
        `${import.meta.env.VITE_BACKEND_URL}/notes`,
        {
          params: {
            page: pageNumber,
            size
          }
        }
      )
      const data = response.data

      setNotes((prev) => (reset ? data.content : [...prev, ...data.content]))
      setPage(data.number)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch (error) {
      toast.error("Failed to fetch notes")
    }
  }

  const reloadNotes = async () => {
    try {
      let allNotes: Note[] = []
      let currentPage = 0
      let total = 1

      do {
        const response = await axios.get<PaginatedResponse<Note>>(
          `${import.meta.env.VITE_BACKEND_URL}/notes`,
          {
            params: {
              page: currentPage,
              size
            }
          }
        )

        const data = response.data
        allNotes = [...allNotes, ...data.content]
        total = data.totalPages
        currentPage++
      } while (currentPage < total)

      setNotes(allNotes)
      setPage(0)
      setTotalPages(1)
      setTotalElements(allNotes.length)
    } catch (error) {
      toast.error("Failed to reload all notes")
    }
  }

  const loadNextPage = async () => {
    if (page + 1 >= totalPages) return
    setIsLoadingMore(true)
    await fetchNotes(page + 1)
    setIsLoadingMore(false)
  }

  const addNote = async (note: Omit<Note, "id">): Promise<Note> => {
    if (!note.name.trim() || !note.description.trim())
      throw new Error("Note name and description cannot be empty.")

    const temporaryId = crypto.randomUUID()
    const optimisticNote: Note = { ...note, id: temporaryId }

    setNotes((prev) => [...prev, optimisticNote])

    try {
      const response = await axios.post<Note>(
        `${import.meta.env.VITE_BACKEND_URL}/notes`,
        note
      )
      const savedNote = response.data

      setNotes((prev) =>
        prev.map((n) => (n.id === temporaryId ? { ...savedNote } : n))
      )
      return savedNote
    } catch (error) {
      toast.error("Failed to add note")
      setNotes((prev) => prev.filter((n) => n.id !== temporaryId))
      throw error
    }
  }

  const updateNote = async (id: string, updated: Partial<Note>) => {
    const previous = notes.find((n) => n.id === id)
    if (!previous) return

    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updated } : n))
    )

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/notes/${id}`,
        updated
      )
    } catch (error) {
      toast.error("Failed to update note")
      setNotes((prev) => prev.map((n) => (n.id === id ? previous : n)))
      throw error
    }
  }

  const deleteNote = async (id: string) => {
    const deleted = notes.find((n) => n.id === id)
    if (!deleted) return

    setNotes((prev) => prev.filter((n) => n.id !== id))

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/notes/${id}`)
    } catch (error) {
      toast.error("Failed to delete note")
      setNotes((prev) => [...prev, deleted])
      throw error
    }
  }

  useEffect(() => {
    reloadNotes()
  }, [])

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    reloadNotes,
    loadNextPage,
    page,
    size,
    totalPages,
    totalElements,
    isLoadingMore
  }
}

export default useNote
