import { useEffect, useState } from 'react';
import { Calendar } from '../types';

const API_URL = '/calendar';

export function useCalendars() {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendars = async () => {
    try {
      const response = await fetch(API_URL);
      const data: Calendar[] = await response.json();
      setCalendars(data);
    } catch (err) {
      setError('Failed to fetch calendars');
    } finally {
      setLoading(false);
    }
  };

  const createCalendar = async (calendar: Omit<Calendar, 'id'>) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(calendar),
    });
    if (response.ok) fetchCalendars();
  };

  const updateCalendar = async (calendar: Calendar) => {
    const response = await fetch(`${API_URL}/${calendar.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(calendar),
    });
    if (response.ok) fetchCalendars();
  };

  const deleteCalendar = async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) fetchCalendars();
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  return {
    calendars,
    loading,
    error,
    createCalendar,
    updateCalendar,
    deleteCalendar,
    refetch: fetchCalendars,
  };
}
