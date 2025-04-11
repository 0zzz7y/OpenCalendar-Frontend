import React from 'react';
import { Box } from '@mui/material';
import { Event } from '../../features/event/types';
import EventCard from './EventCard';

interface EventOverlayProperties {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const EventOverlay: React.FC<EventOverlayProperties> = ({
  events,
  onEventClick,
}) => {
  return (
    <Box position="absolute" top={0} left={0} right={0} bottom={0}>
      {events.map((event) => (
        <Box
          key={event.id}
          sx={{
            position: 'absolute',
            top: `${(event.startDate.getHours() + event.startDate.getMinutes() / 60) * 60}px`,
            height: `${
              ((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60)) || 30
            }px`,
            left: '5%',
            width: '90%',
            pointerEvents: 'none',
          }}
        >
          <EventCard
            id={event.id}
            title={event.name}
            startDate={event.startDate}
            endDate={event.endDate}
            color={event.color || '#1976d2'}
            onClick={() => onEventClick?.(event)}
            />
        </Box>
      ))}
    </Box>
  );
};

export default EventOverlay;
