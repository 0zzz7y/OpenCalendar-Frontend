import {
  Popover,
  TextField,
  MenuItem,
  Button,
  Stack,
  Divider,
  ClickAwayListener,
  Typography
} from "@mui/material";

import { DateCalendar, TimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";

import dayjs, { Dayjs } from "dayjs";

import Event from "../../types/event";

interface Properties {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSave: (event: Partial<Event>) => void;
  calendars: { id: string; name: string }[];
  categories: { id: string; name: string; emoji: string }[];
  initialEvent?: Event;
}

function EventPopover({
  anchorEl,
  onClose,
  onSave,
  calendars,
  categories,
  initialEvent
}: Properties) {
  const open = Boolean(anchorEl);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [time, setTime] = useState<Dayjs | null>(dayjs());
  const [calendarId, setCalendarId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.name);
      setDescription(initialEvent.description || "");
      const dateTime = dayjs(initialEvent.startDate);
      setDate(dateTime);
      setTime(dateTime);
      setCalendarId(initialEvent.calendarId);
      setCategoryId(initialEvent.categoryId || "");
    } else {
      setTitle("");
      setDescription("");
      setDate(dayjs());
      setTime(dayjs());
      setCalendarId("");
      setCategoryId("");
    }
  }, [initialEvent, open]);

  const handleSave = () => {
    if (!title || !date || !time) return;

    const eventDateTime = date
      ?.hour(time?.hour() || 0)
      .minute(time?.minute() || 0)
      .second(0)
      .millisecond(0)
      .toISOString();

    onSave({
      id: initialEvent?.id,
      name: title,
      description,
      calendarId,
      categoryId,
      startDate: eventDateTime,
      endDate: eventDateTime
    });

    onClose();
  };

  return (
    <>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        PaperProps={{
          sx: {
            p: 2,
            width: 340,
            maxHeight: "90vh",
            overflowY: "auto"
          }
        }}
      >
        <ClickAwayListener onClickAway={onClose}>
          <Stack spacing={2}>
            <Typography variant="h6">
              {initialEvent ? "Edit Event" : "New Event"}
            </Typography>

            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />

            <TextField
              label="Calendar"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              select
              fullWidth
            >
              {calendars.map((cal) => (
                <MenuItem key={cal.id} value={cal.id}>
                  {cal.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              select
              fullWidth
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </MenuItem>
              ))}
            </TextField>

            <Divider />

            <DateCalendar
              value={date}
              onChange={(newDate) => setDate(newDate)}
            />

            <TimePicker
              label="Time"
              value={time}
              onChange={(newTime) => setTime(newTime)}
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button onClick={onClose} color="inherit">
                Cancel
              </Button>
              <Button onClick={handleSave} variant="contained">
                {initialEvent ? "Save" : "Add"}
              </Button>
            </Stack>
          </Stack>
        </ClickAwayListener>
      </Popover>
    </>
  );
}

export default EventPopover;
