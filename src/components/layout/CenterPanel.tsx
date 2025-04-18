import { useState } from "react";

import { Box, Typography, Button, CircularProgress } from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import dayjs from "dayjs";

import DayView from "../calendar/DayView";
import WeekView from "../calendar/WeekView";
import MonthView from "../calendar/MonthView";
import EventPopover from "../event/EventCreationPopover";
import EventInformationPopover from "../event/EventInformationPopover";

import useDashboard from "../../hooks/useDashboard";
import useFilters from "../../hooks/useFilters";

import Event from "../../types/event";

const CenterPanel = () => {
  const {
    events,
    calendars,
    categories,
    loading,
    addEvent,
    updateEvent,
    deleteEvent
  } = useDashboard();

  const { selectedCalendar, selectedCategory } = useFilters();

  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<HTMLElement | null>(null);
  const [selectedDatetime, setSelectedDatetime] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [infoEvent, setInfoEvent] = useState<Event | null>(null);
  const [infoAnchor, setInfoAnchor] = useState<HTMLElement | null>(null);

  const filteredEvents = Array.isArray(events)
    ? events.filter((event) => {
        const calendarMatch =
          selectedCalendar === "all" || event.calendarId === selectedCalendar;
        const categoryMatch =
          selectedCategory === "all" || event.categoryId === selectedCategory;
        return calendarMatch && categoryMatch;
      })
    : [];

  const handleSlotClick = (element: HTMLElement, datetime: Date) => {
    setSelectedSlot(element);
    setSelectedDatetime(datetime);
    setEditingEvent(null);
    setInfoEvent(null);
  };

  const handleEventClick = (event: Event) => {
    const element = document.querySelector(`#event-${event.id}`) as HTMLElement;
    if (element) {
      setInfoAnchor(element);
      setInfoEvent(event);
    }
  };

  const handleClosePopover = () => {
    setSelectedSlot(null);
    setSelectedDatetime(null);
    setEditingEvent(null);
  };

  const handleSave = async (data: Partial<Event>) => {
    if (!data.startDate) return;

    const exists = events.find((e) => e.id === data.id);

    if (exists && data.id) {
      await updateEvent(data.id, data);
    } else {
      const newEvent: Omit<Event, "id"> = {
        name: data.name ?? "Nowe wydarzenie",
        description: data.description ?? "",
        startDate: data.startDate,
        endDate: data.endDate ?? data.startDate,
        color: data.color ?? "#1976d2",
        calendarId: data.calendarId ?? "",
        categoryId: data.categoryId
      };

      await addEvent(newEvent);
    }

    handleClosePopover();
  };

  const handleEditEvent = () => {
    setEditingEvent(infoEvent);
    setSelectedDatetime(infoEvent ? new Date(infoEvent.startDate) : null);
    setSelectedSlot(infoAnchor);
    setInfoEvent(null);
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id);
    setInfoEvent(null);
  };

  const navigate = (direction: "prev" | "next") => {
    const unit = view === "month" ? "month" : view === "week" ? "week" : "day";
    const delta = direction === "next" ? 1 : -1;
    setSelectedDate(dayjs(selectedDate).add(delta, unit).toDate());
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Button onClick={() => navigate("prev")} size="large">
            <ChevronLeftIcon fontSize="medium" />
          </Button>
          <Typography variant="h6">
            {dayjs(selectedDate).format(
              view === "month" ? "MMMM YYYY" : "DD MMM YYYY"
            )}
          </Typography>
          <Button onClick={() => navigate("next")} size="large">
            <ChevronRightIcon fontSize="medium" />
          </Button>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            onClick={() => setView("day")}
            variant={view === "day" ? "outlined" : "text"}
          >
            Day
          </Button>
          <Button
            onClick={() => setView("week")}
            variant={view === "week" ? "outlined" : "text"}
          >
            Week
          </Button>
          <Button
            onClick={() => setView("month")}
            variant={view === "month" ? "outlined" : "text"}
          >
            Month
          </Button>
        </Box>
      </Box>

      {view === "day" && (
        <DayView
          date={selectedDate}
          events={filteredEvents}
          onSlotClick={handleSlotClick}
          onSave={handleSave}
          onEventClick={handleEventClick}
          calendars={calendars}
          categories={categories}
        />
      )}

      {view === "week" && (
        <WeekView
          date={selectedDate}
          events={filteredEvents}
          onSlotClick={handleSlotClick}
          onSave={handleSave}
          onEventClick={handleEventClick}
          calendars={calendars}
          categories={categories}
        />
      )}

      {view === "month" && (
        <MonthView
          date={selectedDate}
          events={filteredEvents}
          onSlotClick={handleSlotClick}
          onSave={handleSave}
          onEventClick={handleEventClick}
          calendars={calendars}
          categories={categories}
        />
      )}

      {selectedSlot && selectedDatetime && (
        <EventPopover
          anchorEl={selectedSlot}
          onClose={handleClosePopover}
          onSave={handleSave}
          calendars={calendars}
          categories={categories}
          initialEvent={
            editingEvent ?? {
              id: "",
              name: "",
              description: "",
              startDate: selectedDatetime.toISOString(),
              endDate: new Date(
                selectedDatetime.getTime() + 60 * 60 * 1000
              ).toISOString(),
              calendarId: "",
              categoryId: undefined,
              color: "#1976d2"
            }
          }
        />
      )}

      <EventInformationPopover
        anchorEl={infoAnchor}
        event={infoEvent}
        onClose={() => setInfoEvent(null)}
        onEdit={handleEditEvent}
        onDelete={() => infoEvent && handleDeleteEvent(infoEvent.id)}
      />
    </>
  );
};

export default CenterPanel;
