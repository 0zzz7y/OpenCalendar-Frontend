import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Event from "../types/event";

const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get<Event[]>(`${import.meta.env.VITE_BACKEND_URL}/events`);
      console.log("Events fetched:", response.data);
      setEvents(response.data);
    } catch (error) {
      toast.error("Failed to fetch events");
    }
  };

  const addEvent = async (event: Omit<Event, "id">) => {
    try {
      const response = await axios.post<Event>(`${import.meta.env.VITE_BACKEND_URL}/events`, event);
      console
      setEvents([response.data]);
    } catch (error) {
      toast.error("Failed to add event");
    }
  };

  const updateEvent = async (id: string, updated: Partial<Event>) => {
    try {
      const response = await axios.put<Event>(`${import.meta.env.VITE_BACKEND_URL}/events/${id}`, updated);
      console.log("Event updated:", response.data);
      setEvents((prev) => prev.map((e) => (e.id === id ? response.data : e)));
    } catch (error) {
      toast.error("Failed to update event");
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/events/${id}`);
      console.log("Event deleted:", id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  return {
    events,
    setEvents,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent
  };
};

export default useEvents;
