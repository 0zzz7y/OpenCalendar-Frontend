import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Event from "../types/event";

const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get<Event[]>("/events");
      setEvents(response.data ?? []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    setEvents,
    fetchEvents
  };
};

export default useEvents;
