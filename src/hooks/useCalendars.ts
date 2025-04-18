import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "../types/calendar";

const useCalendars = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);

  const fetchCalendars = async () => {
    try {
      const response = await axios.get<Calendar[]>(`${import.meta.env.VITE_BACKEND_URL}/calendars`);
      console.log("Calendars fetched:", response.data);
      setCalendars(response.data);
    } catch (error) {
      console.error("Error fetching calendars:", error);
    }
  };

  const addCalendar = async (calendar: Omit<Calendar, "id">) => {
    try {
      const response = await axios.post<Calendar>(`${import.meta.env.VITE_BACKEND_URL}/calendars`, calendar);
      console.log("Calendar added:", response.data);
      setCalendars((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding calendar:", error);
    }
  };

  const updateCalendar = async (id: string, updated: Partial<Calendar>) => {
    try {
      const response = await axios.put<Calendar>(`${import.meta.env.VITE_BACKEND_URL}/calendars/${id}`, updated);
      console.log("Calendar updated:", response.data);
      setCalendars((prev) =>
        prev.map((calendar) => (calendar.id === id ? response.data : calendar))
      );
    } catch (error) {
      console.error("Error updating calendar:", error);
    }
  };

  const deleteCalendar = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/calendars/${id}`);
      console.log("Calendar deleted:", id);
      setCalendars((prev) => prev.filter((calendar) => calendar.id !== id));
    } catch (error) {
      console.error("Error deleting calendar:", error);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  return {
    calendars,
    setCalendars,
    fetchCalendars,
    addCalendar,
    updateCalendar,
    deleteCalendar
  };
};

export default useCalendars;
