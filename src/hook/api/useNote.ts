import AppContext from "@/context/AppContext"
import PaginatedResponse from "@/type/communication/paginatedResponse"
import Note from "@/type/domain/note"
import NoteDto from "@/type/dto/noteDto"
import { toNote, toNoteDto } from "@/type/mapper/noteMapper"

import { useEffect, useState, useContext } from "react"

import axios from "axios"
import { toast } from "react-toastify"

const useNote = () => {
  const { calendars = [], categories = [] } = useContext(AppContext) || {}

  const [notes, setNotes] = useState<Note[]>([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const mapDtoToNote = (noteDto: NoteDto): Note => {
    const calendar = calendars.find((cal) => cal.id === noteDto.calendarId)
    const category = categories.find((cat) => cat.id === noteDto.categoryId)

    if (!calendar) throw new Error(`Calendar not found for note ${noteDto.id}`)

    return toNote(noteDto, calendar, category)
  }

  const fetchNotes = async (pageNumber = 0, reset = false) => {
    try {
      const response = await axios.get<PaginatedResponse<NoteDto>>(
        `${import.meta.env.VITE_BACKEND_URL}/notes`,
        { params: { page: pageNumber, size } }
      )
      const data = response.data
      const mappedNotes = data.content.map(mapDtoToNote)

      setNotes((prev) => (reset ? mappedNotes : [...prev, ...mappedNotes]))
      setPage(data.number)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch {
      toast.error("Failed to fetch notes")
    }
  }

  const reloadNotes = async () => {
    try {
      let allNotes: Note[] = []
      let currentPage = 0
      let total = 1

      do {
        const response = await axios.get<PaginatedResponse<NoteDto>>(
          `${import.meta.env.VITE_BACKEND_URL}/notes`,
          { params: { page: currentPage, size } }
        )
        const data = response.data
        const mappedNotes = data.content.map(mapDtoToNote)

        allNotes = [...allNotes, ...mappedNotes]
        total = data.totalPages
        currentPage++
      } while (currentPage < total)

      setNotes(allNotes)
      setPage(0)
      setTotalPages(1)
      setTotalElements(allNotes.length)
    } catch {
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
    if (!note.name?.trim() || !note.description.trim()) {
      throw new Error("Note name and description cannot be empty.")
    }

    const tempId = crypto.randomUUID()
    const optimisticNote: Note = { ...note, id: tempId }
    setNotes((prev) => [...prev, optimisticNote])

    try {
      const response = await axios.post<NoteDto>(
        `${import.meta.env.VITE_BACKEND_URL}/notes`,
        toNoteDto({ id: "", ...note })
      )
      const savedNote = toNote(response.data, note.calendar, note.category)
      setNotes((prev) => prev.map((n) => (n.id === tempId ? savedNote : n)))
      return savedNote
    } catch (error) {
      toast.error("Failed to add note")
      setNotes((prev) => prev.filter((n) => n.id !== tempId))
      throw error
    }
  }

  const updateNote = async (id: string, updated: Partial<Note>) => {
    const previous = notes.find((n) => n.id === id)
    if (!previous) return

    const merged = {
      ...previous,
      ...updated
    }

    setNotes((prev) => prev.map((n) => (n.id === id ? merged : n)))

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/notes/${id}`,
        toNoteDto(merged)
      )
    } catch {
      toast.error("Failed to update note")
      setNotes((prev) => prev.map((n) => (n.id === id ? previous : n)))
    }
  }

  const deleteNote = async (id: string) => {
    const deleted = notes.find((n) => n.id === id)
    if (!deleted) return

    setNotes((prev) => prev.filter((n) => n.id !== id))

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/notes/${id}`)
    } catch {
      toast.error("Failed to delete note")
      setNotes((prev) => [...prev, deleted])
    }
  }

  useEffect(() => {
    if (calendars.length > 0) reloadNotes()
  }, [calendars, categories])

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
