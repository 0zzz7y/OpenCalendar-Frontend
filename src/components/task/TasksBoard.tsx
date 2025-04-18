import { Box } from "@mui/material";

import TaskCard from "./TaskCard";

import Task from "../../types/task";
import Calendar from "../../types/calendar";
import Category from "../../types/category";
import TaskStatus from "../../types/taskStatus";

import { HourglassEmpty, Done, Pending } from "@mui/icons-material";
import { JSX } from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd";

interface Properties {
  tasks: Task[];
  calendars: Calendar[];
  categories: Category[];
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const TaskBoard = ({
  tasks,
  calendars,
  categories,
  onUpdate,
  onDelete
}: Properties) => {
  const columns: { [key in TaskStatus]: { title: string; icon: JSX.Element } } =
    {
      TODO: { title: "Do zrobienia", icon: <HourglassEmpty /> },
      IN_PROGRESS: { title: "W trakcie", icon: <Pending /> },
      DONE: { title: "Zrobione", icon: <Done /> }
    };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination, source } = result;
    if (destination.droppableId === source.droppableId) return;

    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    const updatedTask: Task = {
      ...task,
      status: destination.droppableId as TaskStatus
    };

    onUpdate(updatedTask);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        gap={2}
      >
        {Object.entries(columns).map(([status, { title, icon }]) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  width: "100%",
                  minHeight: 300,
                  p: 1,
                  bgcolor: "#f5f5f5",
                  borderRadius: 2
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  {icon}
                  <strong>{title}</strong>
                </Box>

                {tasks
                  .filter((t) => t.status === status)
                  .map((task, index) => (
                    <Draggable
                      draggableId={task.id}
                      index={index}
                      key={task.id}
                    >
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            calendars={calendars}
                            categories={categories}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                          />
                        </Box>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        ))}
      </Box>
    </DragDropContext>
  );
};

export default TaskBoard;
