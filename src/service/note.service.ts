import type Note from "@/model/domain/note"
import axios from "axios"

const base = `${import.meta.env.VITE_BASE_URL}/notes`

export const getNotes = async (): Promise<Note[]> => {
  const result = await axios.get(base)
  return result.data
}

export const createNote = async (note: Partial<Note>): Promise<Note> => {
  const result = await axios.post(base, note)
  return result.data
}

export const updateNote = async (id: string, updates: Partial<Note>): Promise<Note> => {
  const result = await axios.put(`${base}/${id}`, updates)
  return result.data
}

export const deleteNote = async (id: string): Promise<void> => {
  await axios.delete(`${base}/${id}`)
}