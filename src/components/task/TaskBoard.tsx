import React from 'react';
import { Box, Typography } from '@mui/material';
import TaskCard from './TaskCard';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { Task, TaskStatus } from '../../features/task/types';

interface TaskBoardProperties {
  tasks: Task[];
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick?: (task: Task) => void;
}

const TaskBoard: React.FC<TaskBoardProperties> = ({
  tasks,
  onTaskStatusChange,
  onTaskClick,
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    onTaskStatusChange?.(taskId, newStatus);
  };

  const columns: { key: TaskStatus; label: string }[] = [
    { key: TaskStatus.TODO, label: 'To Do' },
    { key: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { key: TaskStatus.DONE, label: 'Done' },
  ];

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', gap: 2, padding: 2, overflowX: 'auto' }}>
        {columns.map((column) => (
          <DroppableColumn
            key={column.key}
            id={column.key}
            label={column.label}
            tasks={tasks.filter((t) => t.status === column.key)}
            onTaskClick={onTaskClick}
          />
        ))}
      </Box>
    </DndContext>
  );
};

export default TaskBoard;

interface DroppableColumnProperties {
  id: TaskStatus;
  label: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const DroppableColumn: React.FC<DroppableColumnProperties> = ({
  id,
  label,
  tasks,
  onTaskClick,
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        flex: 1,
        minWidth: 250,
        backgroundColor: '#f9f9f9',
        borderRadius: 2,
        padding: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="subtitle1" mb={1}>
        {label}
      </Typography>
      {tasks.map((task) => (
        <DraggableTaskCard key={task.id} task={task} onClick={() => onTaskClick?.(task)} />
      ))}
    </Box>
  );
};

interface DraggableTaskCardProperties {
  task: Task;
  onClick?: () => void;
}

const DraggableTaskCard: React.FC<DraggableTaskCardProperties> = ({
  task,
  onClick,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    zIndex: transform ? 1000 : 'auto',
    touchAction: 'none',
  };

  return (
    <Box ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TaskCard task={task} onClick={onClick} />
    </Box>
  );
};
