import { Box } from "@mui/material";

import CalendarGridCell from "./CalendarGridCell";
import EventBox from "../event/EventBox";

import Event from "../../types/event";

interface DayColumnProperties {
  date: Date;
  events: Event[];
  allEvents: Event[];
  calendars: { id: string; name: string; emoji: string }[];
  categories: { id: string; name: string; color: string }[];
  onSave: (event: Partial<Event> & { startDate: string }) => void;
  onSlotClick?: (slot: HTMLElement, datetime: Date) => void;
  showPopoverLine?: boolean;
  dragTargetId?: string | null;
  onEventClick?: (event: Event) => void;
}

const DayColumn = ({
  date,
  events,
  allEvents,
  calendars,
  categories,
  onSave,
  onSlotClick,
  showPopoverLine,
  dragTargetId,
  onEventClick
}: DayColumnProperties) => {
  const slots = Array.from({ length: 24 * 4 }, (_, i) => {
    const d = new Date(date);
    d.setHours(Math.floor(i / 4), (i % 4) * 15, 0, 0);
    return d;
  });

  const handleSlotClick = (datetime: Date, element: HTMLElement) => {
    onSlotClick?.(element, datetime);
  };

  const doEventsOverlap = (a: Event, b: Event) => {
    const startA = new Date(a.startDate).getTime();
    const endA = new Date(a.endDate).getTime();
    const startB = new Date(b.startDate).getTime();
    const endB = new Date(b.endDate).getTime();
    return startA < endB && startB < endA;
  };

  const groupOverlappingEvents = (events: Event[]) => {
    const groups: Event[][] = [];

    events.forEach((event) => {
      let added = false;

      for (const group of groups) {
        if (group.some((e) => doEventsOverlap(e, event))) {
          group.push(event);
          added = true;
          break;
        }
      }

      if (!added) {
        groups.push([event]);
      }
    });

    return groups;
  };

  const computeLayout = (events: Event[]) => {
    const layouted: (Event & { customStyle: React.CSSProperties })[] = [];
    const groups = groupOverlappingEvents(events);

    groups.forEach((group) => {
      const sorted = [...group].sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );

      const width = 100 / sorted.length;
      const gap = 4;

      sorted.forEach((event, i) => {
        layouted.push({
          ...event,
          customStyle: {
            position: "absolute",
            width: `calc(${width}% - ${gap}px)`,
            left: `calc(${i * width}% + ${i * gap}px)`,
            opacity: dragTargetId ? 0.6 : 1,
            pointerEvents:
              dragTargetId && dragTargetId !== event.id ? "none" : "auto"
          }
        });
      });
    });

    return layouted;
  };

  const layoutedEvents = computeLayout(events);

  return (
    <Box
      flex={1}
      borderLeft="1px solid #ddd"
      position="relative"
      minHeight={24 * 4 * 32}
    >
      {slots.map((slot, i) => (
        <CalendarGridCell
          key={i}
          datetime={slot}
          allEvents={allEvents}
          onSave={onSave}
          onClick={(el) => handleSlotClick(slot, el)}
        />
      ))}

      {layoutedEvents.map((event) => (
        <EventBox
          key={event.id}
          event={event}
          calendars={calendars}
          categories={categories}
          dragTargetId={dragTargetId}
          showPopoverLine={showPopoverLine}
          customStyle={{
            zIndex: 20,
            ...event.customStyle
          }}
          onClick={() => onEventClick?.(event)}
        />
      ))}
    </Box>
  );
};

export default DayColumn;
