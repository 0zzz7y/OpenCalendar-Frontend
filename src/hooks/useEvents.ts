import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Event from "../types/event";

const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchEvents = async (pageNumber = 0, reset = false) => {
    try {
      const response = await axios.get<PaginatedResponse<Event>>(
        `${import.meta.env.VITE_BACKEND_URL}/events`,
        { params: { page: pageNumber, size } }
      );

      const data = response.data;

      setEvents((prev) => reset ? data.content : [...prev, ...data.content]);
      setPage(data.number);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      toast.error("Failed to fetch events");
    }
  };

  const reloadEvents = async () => {
    try {
      let allEvents: Event[] = [];
      let currentPage = 0;
      let total = 1;

      do {
        const response = await axios.get<PaginatedResponse<Event>>(
          `${import.meta.env.VITE_BACKEND_URL}/events`,
          { params: { page: currentPage, size } }
        );

        const data = response.data;
        allEvents = [...allEvents, ...data.content];
        total = data.totalPages;
        currentPage++;
      } while (currentPage < total);

      setEvents(allEvents);
      setPage(0);
      setTotalPages(1);
      setTotalElements(allEvents.length);
    } catch (error) {
      toast.error("Failed to reload all events");
    }
  };

  const loadNextPage = async () => {
    if (page + 1 >= totalPages) return;
    setIsLoadingMore(true);
    await fetchEvents(page + 1);
    setIsLoadingMore(false);
  };

  const addEvent = async (event: Omit<Event, "id">) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/events`, event);
      await reloadEvents();
    } catch (error) {
      toast.error("Failed to add event");
    }
  };

  const updateEvent = async (id: string, updated: Partial<Event>) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/events/${id}`, updated);
      await reloadEvents();
    } catch (error) {
      toast.error("Failed to update event");
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/events/${id}`);
      await reloadEvents();
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  useEffect(() => {
    reloadEvents();
  }, []);

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    reloadEvents,
    loadNextPage,
    page,
    size,
    totalPages,
    totalElements,
    isLoadingMore
  };
};

export default useEvents;
