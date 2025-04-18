import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "../types/calendar";

const useCalendars = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchCalendars = async (pageNumber = 0, reset = false) => {
    try {
      const response = await axios.get<PaginatedResponse<Calendar>>(
        `${import.meta.env.VITE_BACKEND_URL}/calendars`,
        { params: { page: pageNumber, size } }
      );

      const data = response.data;

      setCalendars((prev) => reset ? data.content : [...prev, ...data.content]);
      setPage(data.number);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Error fetching calendars:", error);
    }
  };

  const reloadCalendars = async () => {
    try {
      let allCalendars: Calendar[] = [];
      let currentPage = 0;
      let total = 1;

      do {
        const response = await axios.get<PaginatedResponse<Calendar>>(
          `${import.meta.env.VITE_BACKEND_URL}/calendars`,
          { params: { page: currentPage, size } }
        );

        const data = response.data;
        allCalendars = [...allCalendars, ...data.content];
        total = data.totalPages;
        currentPage++;
      } while (currentPage < total);

      setCalendars(allCalendars);
      setPage(0);
      setTotalPages(1);
      setTotalElements(allCalendars.length);
    } catch (error) {
      console.error("Error reloading all calendars:", error);
    }
  };

  const loadNextPage = async () => {
    if (page + 1 >= totalPages) return;
    setIsLoadingMore(true);
    await fetchCalendars(page + 1);
    setIsLoadingMore(false);
  };

  const addCalendar = async (calendar: Omit<Calendar, "id">) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/calendars`, calendar);
      await reloadCalendars();
    } catch (error) {
      console.error("Error adding calendar:", error);
    }
  };

  const updateCalendar = async (id: string, updated: Partial<Calendar>) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/calendars/${id}`, updated);
      await reloadCalendars();
    } catch (error) {
      console.error("Error updating calendar:", error);
    }
  };

  const deleteCalendar = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/calendars/${id}`);
      await reloadCalendars();
    } catch (error) {
      console.error("Error deleting calendar:", error);
    }
  };

  useEffect(() => {
    reloadCalendars();
  }, []);

  return {
    calendars,
    addCalendar,
    updateCalendar,
    deleteCalendar,
    reloadCalendars,
    loadNextPage,
    page,
    size,
    totalPages,
    totalElements,
    isLoadingMore
  };
};

export default useCalendars;
