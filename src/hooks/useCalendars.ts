import { useState, useCallback, useEffect } from "react";
import axios from "axios";

import Calendar from "../types/calendar";

export const useCalendars = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);

  const fetchCalendars = useCallback(async () => {
    try {
      const response = await axios.get<Calendar[]>("/calendars");
      setCalendars(response.data ?? []);
    } catch (error) {
      console.error("Error fetching calendars:", error);
      setCalendars([]);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchCalendars();
  }, [fetchCalendars]);

  return {
    calendars,
    setCalendars,
    fetchCalendars
  };
};

export default useCalendars;
