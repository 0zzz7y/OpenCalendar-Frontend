import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';

interface EventCardProperties {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  color: string;
  onClick?: () => void;
}

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const EventCard: React.FC<EventCardProperties> = ({
  title,
  startDate,
  endDate,
  color,
  onClick,
}) => {
  return (
    <Tooltip title={`${formatTime(startDate)} – ${formatTime(endDate)}`} placement="top">
      <Box
        onClick={onClick}
        sx={{
          position: 'absolute',
          top: `${(startDate.getHours() * 60 + startDate.getMinutes())}px`, // will be adjusted by parent
          height: `${(endDate.getTime() - startDate.getTime()) / 60000}px`, // height in px = duration in minutes
          left: 4,
          right: 4,
          padding: '2px 6px',
          backgroundColor: color,
          borderRadius: 1,
          boxShadow: 1,
          color: '#fff',
          fontSize: '0.75rem',
          lineHeight: 1.2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: '#333',
            opacity: 0.9,
          },
        }}
      >
        <Typography variant="caption" noWrap>
          {title}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default EventCard;
