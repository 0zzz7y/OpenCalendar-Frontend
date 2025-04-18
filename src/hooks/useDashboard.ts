import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import useEvents from "./useEvents";
import useTasks from "./useTasks";
import useNotes from "./useNotes";
import useCalendars from "./useCalendars";
import useCategories from "./useCategories";

const useDashboard = () => {
  const { events, setEvents, fetchEvents, addEvent, updateEvent, deleteEvent } =
    useEvents();

  const { tasks, setTasks, fetchTasks, addTask, updateTask, deleteTask } =
    useTasks();

  const { notes, setNotes, fetchNotes, addNote, updateNote, deleteNote } =
    useNotes();

  const { calendars, setCalendars, fetchCalendars } = useCalendars();
  const { categories, setCategories, fetchCategories } = useCategories();

  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchEvents().catch(() => toast.error("Failed to load events")),
        fetchTasks().catch(() => toast.error("Failed to load tasks")),
        fetchNotes().catch(() => toast.error("Failed to load notes")),
        fetchCalendars().catch(() => toast.error("Failed to load calendars")),
        fetchCategories().catch(() => toast.error("Failed to load categories"))
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    events: Array.isArray(events) ? events : [],
    setEvents,
    addEvent,
    updateEvent,
    deleteEvent,

    tasks: Array.isArray(tasks) ? tasks : [],
    setTasks,
    addTask,
    updateTask,
    deleteTask,

    notes: Array.isArray(notes) ? notes : [],
    setNotes,
    addNote,
    updateNote,
    deleteNote,

    calendars: Array.isArray(calendars) ? calendars : [],
    setCalendars,

    categories: Array.isArray(categories) ? categories : [],
    setCategories,

    loading,
    refetch: fetchAll
  };
};

export default useDashboard;
