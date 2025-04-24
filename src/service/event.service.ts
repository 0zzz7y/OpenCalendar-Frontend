import type Event from "@/model/domain/event"
import axios from "axios"

const base = `${import.meta.env.VITE_BASE_URL}/events`

export const getEvents = async (): Promise<Event[]> => {
  const result = await axios.get(base)
  return result.data
}

export const createEvent = async (event: Partial<Event>): Promise<Event> => {
  const result = await axios.post(base, event)
  return result.data
}

export const updateEvent = async (id: string, updates: Partial<Event>): Promise<Event> => {
  const result = await axios.put(`${base}/${id}`, updates)
  return result.data
}

export const deleteEvent = async (id: string): Promise<void> => {
  await axios.delete(`${base}/${id}`)
}