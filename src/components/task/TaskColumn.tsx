import React from 'react';
import { Box, Typography } from '@mui/material';
import { Task, TaskStatus } from '../../features/task/types';
import TaskCard from './TaskCard';

interface TaskColumnProperties {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskStatusChange?: (id: string, newStatus: TaskStatus) => void;
}

const TaskColumn: React.FC<TaskColumnProperties> = ({
  status,
  tasks,
  onTaskClick,
  onTaskStatusChange,
}) => {
  return (
    <Box
      sx={{
        width: 300,
        backgroundColor: '#f9f9f9',
        borderRadius: 2,
        padding: 2,
        boxShadow: 2,
        flexShrink: 0,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {status.replace('_', ' ')}
      </Typography>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={() => onTaskClick?.(task)}
          onStatusChange={onTaskStatusChange}
        />
      ))}
    </Box>
  );
};

export default TaskColumn;
