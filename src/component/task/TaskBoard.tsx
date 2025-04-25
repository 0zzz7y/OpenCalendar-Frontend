import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Box } from "@mui/material";
import { HourglassEmpty, Pending, Done } from "@mui/icons-material";

import TaskCard from "./TaskCard";
import TaskColumn from "./TaskColumn";
import LABEL from "@/constant/ui/label";
import MESSAGE from "@/constant/ui/message";
import type Calendar from "@/model/domain/calendar";
import type Category from "@/model/domain/category";
import type Task from "@/model/domain/task";
import type TaskStatus from "@/model/domain/taskStatus";

export interface TaskBoardProps {
  tasks: Task[];
  calendars: Calendar[];
  categories: Category[];
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

/**
 * Kanban-style board for tasks, supporting drag-and-drop status changes.
 */
const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  calendars,
  categories,
  onUpdate,
  onDelete,
}) => {
  const columns = useMemo(
    () =>
      ({
        TODO: { title: LABEL.TODO, icon: <HourglassEmpty /> },
        IN_PROGRESS: { title: LABEL.IN_PROGRESS, icon: <Pending /> },
        DONE: { title: LABEL.DONE, icon: <Done /> },
      } as Record<TaskStatus, { title: string; icon: JSX.Element }>),
    []
  );

  const [order, setOrder] = useState<Record<TaskStatus, Task[]>>({
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  });

  // Initialize columns from tasks
  useEffect(() => {
    const safe = Array.isArray(tasks) ? tasks : [];
    setOrder({
      TODO: safe.filter((t) => t.status === "TODO"),
      IN_PROGRESS: safe.filter((t) => t.status === "IN_PROGRESS"),
      DONE: safe.filter((t) => t.status === "DONE"),
    });
  }, [tasks]);

  // Handle drag-and-drop between columns
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;
      if (!destination) return;

      const src = source.droppableId as TaskStatus;
      const dest = destination.droppableId as TaskStatus;
      const srcList = Array.from(order[src]);
      const destList = Array.from(order[dest]);
      const [moved] = srcList.splice(source.index, 1);
      if (!moved) return;

      if (src === dest) {
        srcList.splice(destination.index, 0, moved);
        setOrder((prev) => ({ ...prev, [src]: srcList }));
      } else {
        moved.status = dest;
        destList.splice(destination.index, 0, moved);
        setOrder((prev) => ({ ...prev, [src]: srcList, [dest]: destList }));
        onUpdate(moved);
      }
    },
    [order, onUpdate]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
        {Object.entries(columns).map(([status, { title, icon }]) => (
          <Droppable droppableId={status as TaskStatus} key={status}>
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  flex: 1,
                  minWidth: 240,
                  backgroundColor: snapshot.isDraggingOver
                    ? "#f0f0f0"
                    : "transparent",
                  transition: "background-color 0.2s",
                }}
              >
                <TaskColumn title={title} icon={icon}>
                  {order[status as TaskStatus].map((task, index) => (
                    <Draggable
                      draggableId={task.id}
                      index={index}
                      key={task.id}
                    >
                      {(prov, snap) => (
                        <Box
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          sx={{
                            opacity: snap.isDragging ? 0.85 : 1,
                            transform: snap.isDragging ? "scale(1.02)" : "none",
                            transition: "all 0.15s",
                            cursor: snap.isDragging ? "grabbing" : "grab",
                          }}
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
                </TaskColumn>
              </Box>
            )}
          </Droppable>
        ))}
      </Box>
    </DragDropContext>
  );
};

export default TaskBoard;
