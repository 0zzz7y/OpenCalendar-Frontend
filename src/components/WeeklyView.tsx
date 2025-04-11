import {
  Box,
  CircularProgress,
} from "@mui/material";
import {
  eachDayOfInterval,
  format,
  startOfWeek,
  addDays,
  isSameDay,
  parseISO,
  setHours,
  setMinutes,
  addMinutes,
} from "date-fns";
import { useEffect, useState } from "react";
import type { Event } from "../types/models";
import { getEvents } from "../services/api";
import EventCreationDialog from "./event/EventCreationDialog";

export default function WeeklyView() {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end: addDays(start, 6) });

  const [events, setEvents] = useState<Event[] | null>(null);
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  const [hoverSlot, setHoverSlot] = useState<{ dayIndex: number; slotIndex: number } | null>(null);
  const [previewSlot, setPreviewSlot] = useState<{ dayIndex: number; slotIndex: number } | null>(null);
  const [formAnchor, setFormAnchor] = useState<{
    x: number;
    y: number;
    dayIndex: number;
    slotHeight: number;
  } | null>(null);
  const [formDate, setFormDate] = useState<Date | null>(null);

  const hourHeight = 50;
  const slotHeight = hourHeight / 2;
  const totalSlots = 48;

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch((error) => {
        console.error("Błąd ładowania wydarzeń:", error);
        setEvents([]);
      });
  }, []);

  if (!events) return <CircularProgress />;

  const getSlotFromY = (y: number, dayBox: HTMLDivElement) => {
    const bounds = dayBox.getBoundingClientRect();
    const offsetY = y - bounds.top;
    return Math.min(Math.floor(offsetY / slotHeight), totalSlots - 1);
  };

  const handleClick = (
    e: MouseEvent,
    day: Date,
    dayIndex: number,
    dayBox: HTMLDivElement
  ) => {
    const slotIndex = getSlotFromY(e.clientY, dayBox);
    const hour = Math.floor(slotIndex / 2);
    const minute = slotIndex % 2 === 1 ? 30 : 0;
    const clickedDate = setMinutes(setHours(day, hour), minute);
  
    // znajdź bounding box slotu (przedziału czasowego)
    const boxBounds = dayBox.getBoundingClientRect();
    const slotTop = boxBounds.top + slotIndex * slotHeight;
  
    setFormDate(clickedDate);
    setFormAnchor({
      x: boxBounds.left,
      y: slotTop,
      dayIndex,
      slotHeight: slotHeight,
    });
    setPreviewSlot({ dayIndex, slotIndex });
  };
  

  const handleDrop = (
    e: DragEvent,
    day: Date,
    dayIndex: number,
    dayBox: HTMLDivElement
  ) => {
    e.preventDefault();
    const slotIndex = getSlotFromY(e.clientY, dayBox);
    const hour = Math.floor(slotIndex / 2);
    const minute = slotIndex % 2 === 1 ? 30 : 0;
    const newDate = setMinutes(setHours(day, hour), minute);

    if (draggedEventId) {
      setEvents((prev) =>
        prev
          ? prev.map((ev) =>
              ev.id === draggedEventId ? { ...ev, startDate: newDate.toISOString() } : ev
            )
          : prev
      );
    }

    setDraggedEventId(null);
    setHoverSlot(null);
  };

  const handleDragOver = (
    e: DragEvent,
    dayIndex: number,
    dayBox: HTMLDivElement
  ) => {
    e.preventDefault();
    const slotIndex = getSlotFromY(e.clientY, dayBox);
    setHoverSlot({ dayIndex, slotIndex });
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: "60px" }} />
        {days.map((day, index) => (
          <Box
            key={index}
            sx={{ flex: 1, textAlign: "center", fontWeight: "bold", pb: 1 }}
          >
            {format(day, "EEEE dd.MM")}
          </Box>
        ))}
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", height: "100%" }}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "60px", flexShrink: 0 }}>
            {Array.from({ length: 24 }, (_, i) => (
              <Box
                key={i}
                sx={{
                  height: hourHeight,
                  textAlign: "right",
                  pr: 1,
                  pt: 0.5,
                  fontSize: "0.75rem",
                  color: "gray",
                }}
              >
                {i.toString().padStart(2, "0")}:00
              </Box>
            ))}
          </Box>

          {days.map((day, dayIndex) => (
            <Box
              key={dayIndex}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                borderLeft: "1px solid #ccc",
                borderRight: dayIndex === 6 ? "1px solid #ccc" : "none",
              }}
              ref={(el: HTMLDivElement | null) => {
                if (!el) return;
                el.ondragover = (e) => handleDragOver(e, dayIndex, el);
                el.ondrop = (e) => handleDrop(e, day, dayIndex, el);
                el.onclick = (e) => handleClick(e, day, dayIndex, el);
              }}
            >
              {Array.from({ length: totalSlots }, (_, slotIndex) => (
                <Box
                  key={slotIndex}
                  sx={{
                    height: slotHeight,
                    position: "relative",
                    "&::after": slotIndex % 2 === 0
                      ? {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          borderBottom: "1px dashed #bbb",
                          zIndex: 0,
                        }
                      : undefined,
                  }}
                >
                  {hoverSlot?.dayIndex === dayIndex &&
                    hoverSlot.slotIndex === slotIndex &&
                    draggedEventId && (
                      <Box sx={{
                          position: "absolute",
                          top: 2,
                          left: 2,
                          right: 2,
                          height: slotHeight * 2 - 4,
                          border: "2px dashed #1976d2",
                          borderRadius: 1,
                          backgroundColor: "rgba(25,118,210,0.1)",
                          pointerEvents: "none",
                        }}
                      />
                    )}

                  {previewSlot?.dayIndex === dayIndex &&
                    previewSlot.slotIndex === slotIndex && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 2,
                          left: 2,
                          right: 2,
                          height: slotHeight * 2 - 4,
                          border: "2px dotted #4caf50",
                          borderRadius: 1,
                          pointerEvents: "none",
                        }}
                      />
                    )}

                  {events
                    .filter((event) => {
                      const start = parseISO(event.startDate);
                      return (
                        isSameDay(start, day) &&
                        start.getHours() === Math.floor(slotIndex / 2) &&
                        start.getMinutes() === (slotIndex % 2 === 1 ? 30 : 0)
                      );
                    })
                    .map((event) => (
                      <Box
                        key={event.id}
                        draggable
                        onDragStart={() => setDraggedEventId(event.id)}
                        sx={{
                          position: "absolute",
                          top: 2,
                          left: 4,
                          right: 4,
                          height: slotHeight * 2 - 4,
                          bgcolor: "#1976d2",
                          color: "white",
                          px: 1,
                          fontSize: "0.75rem",
                          borderRadius: 1,
                          cursor: "grab",
                          animation: "fadeInUp 0.3s ease",
                          zIndex: 1,
                        }}
                      >
                        {event.name}
                      </Box>
                    ))}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      {formAnchor && formDate && (
        <EventCreationDialog
          anchor={formAnchor}
          selectedDate={formDate}
          onClose={() => {
            setFormAnchor(null);
            setPreviewSlot(null);
          }}
          onSave={({ name, date, calendarId, category }) => {
            const newEvent: Event = {
              id: crypto.randomUUID(),
              name,
              startDate: date.toISOString(),
              endDate: addMinutes(date, 60).toISOString(),
              recurringPattern: "NONE",
              calendarId,
              categoryId: category,
            };
            setEvents((prev) => [...(prev ?? []), newEvent]);
            setFormAnchor(null);
            setPreviewSlot(null);
          }}
        />
      )}
    </Box>
  );
}
