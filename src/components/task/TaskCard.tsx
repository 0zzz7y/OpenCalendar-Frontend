import React from 'react';
import { Box, Typography } from '@mui/material';
import { Task, TaskStatus } from '../../features/task/types';

interface TaskCardProperties {
  task: Task;
  onClick?: () => void;
  onStatusChange?: (id: string, newStatus: TaskStatus) => void;
}

const TaskCard: React.FC<TaskCardProperties> = ({ task, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: 1,
        padding: 1.5,
        marginBottom: 1.5,
        boxShadow: 1,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#f0f0f0',
        },
      }}
    >
      <Typography variant="body1" fontWeight="bold" gutterBottom noWrap>
        {task.name}
      </Typography>
      {task.description && (
        <Typography variant="body2" color="text.secondary" noWrap>
          {task.description}
        </Typography>
      )}
    </Box>
  );
};

export default TaskCard;
