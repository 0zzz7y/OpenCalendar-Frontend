import React from 'react';
import WeeklyView from '../components/event/WeeklyView';
import { useEvents } from '../features/event/hooks/useEvents';

// FIXME: TEMPORARY
function getCurrentWeek(): Date[] {
    const start = new Date();
    start.setDate(start.getDate() - start.getDay()); // Sunday
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }

  const WeeklyCalendar: React.FC = () => {
  const { events } = useEvents();
  const [weekDates, setWeekDates] = React.useState<Date[]>(getCurrentWeek());

  return (
    <WeeklyView
      weekDates={weekDates}
      onTimeSlotClick={(date) => {
        console.log('Open event dialog for date:', date);
      }}
      // Later: pass events to WeeklyView once visual overlay is implemented
    />
  );
};
