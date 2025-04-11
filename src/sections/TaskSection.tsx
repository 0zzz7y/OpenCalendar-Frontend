import React from 'react';
import TaskBoard from '../components/task/TaskBoard';
import { useTasks } from '../features/task/hooks/useTasks';

const TaskSection: React.FC = () => {
  const { tasks, updateTask, createTask } = useTasks();

  return (
    <TaskBoard
      tasks={tasks}
      onTaskClick={(task) => {
        console.log('Edit task:', task);
      }}
      onTaskStatusChange={(id, newStatus) => {
        const task = tasks.find((t) => t.id === id);
        if (task) updateTask({ ...task, status: newStatus });
      }}
    />
  );
};

export default TaskSection;
