import axios from "axios";
import {
  Event,
  Task,
  Note,
  Calendar,
  Category,
  UUID,
} from "../types/models";

const API = axios.create({ baseURL: "http://localhost:8080" });

// 📅 CALENDARS
export const getCalendars = () => API.get<Calendar[]>("/calendars").then((res: { data: any; }) => res.data);

export const createCalendar = (data: Omit<Calendar, "id">) => API.post<Calendar>("/calendars", data);

export const getCalendarById = (id: UUID) => API.get<Calendar>(`/calendars/${id}`).then((res: { data: any; }) => res.data);

// 🎨 CATEGORIES
export const getCategories = () => API.get<Category[]>("/categories").then((res: { data: any; }) => res.data);

export const createCategory = (data: Omit<Category, "id">) => API.post<Category>("/categories", data);

// 📆 EVENTS
export const getEvents = () => API.get<Event[]>("/events").then((res: { data: any; }) => res.data);

export const getEventById = (id: UUID) => API.get<Event>(`/events/${id}`).then((res: { data: any; }) => res.data);

export const createEvent = (data: Omit<Event, "id">) => API.post<Event>("/events", data);

export const updateEvent = (id: UUID, data: Event) => API.put<Event>(`/events/${id}`, data);

export const deleteEvent = (id: UUID) => API.delete(`/events/${id}`);

// ✅ TASKS
export const getTasks = () => API.get<Task[]>("/tasks").then((res: { data: any; }) => res.data);

export const getTaskById = (id: UUID) => API.get<Task>(`/tasks/${id}`).then((res: { data: any; }) => res.data);

export const createTask = (data: Omit<Task, "id">) => API.post<Task>("/tasks", data);

export const updateTask = (id: UUID, data: Task) => API.put<Task>(`/tasks/${id}`, data);

export const deleteTask = (id: UUID) => API.delete(`/tasks/${id}`);

// 📝 NOTES
export const getNotes = () => API.get<Note[]>("/notes").then((res: { data: any; }) => res.data);

export const getNoteById = (id: UUID) => API.get<Note>(`/notes/${id}`).then((res: { data: any; }) => res.data);

export const createNote = (data: Omit<Note, "id">) => API.post<Note>("/notes", data);

export const updateNote = (id: UUID, data: Note) => API.put<Note>(`/notes/${id}`, data);

export const deleteNote = (id: UUID) => API.delete(`/notes/${id}`);
