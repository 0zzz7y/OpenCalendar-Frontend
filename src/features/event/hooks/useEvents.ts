import { useEffect, useState } from 'react';
import { Event } from '../types';

const URL = '/event';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch(URL);
      const data = await res.json();
      setEvents(data);
    } catch {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (event: Omit<Event, 'id'>) => {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (res.ok) fetchEvents();
  };

  const updateEvent = async (event: Event) => {
    const res = await fetch(`${URL}/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (res.ok) fetchEvents();
  };

  const deleteEvent = async (id: string) => {
    const res = await fetch(`${URL}/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
}
