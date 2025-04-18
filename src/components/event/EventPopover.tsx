import {
  Popover,
  TextField,
  MenuItem,
  Button,
  Stack,
  Divider,
  ClickAwayListener,
  Typography,
  Box
} from "@mui/material";

import { DateCalendar, TimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";

import dayjs, { Dayjs } from "dayjs";

import Event from "../../types/event";

interface Properties {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSave: (event: Partial<Event>) => void;
  calendars: { id: string; name: string; emoji: string }[];
  categories: { id: string; name: string; color: string }[];
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
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs());
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs().add(1, "hour"));
  const [calendarId, setCalendarId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (initialEvent) {
      const start = dayjs(initialEvent.startDate);
      const end = dayjs(initialEvent.endDate);

      setTitle(initialEvent.name);
      setDescription(initialEvent.description || "");
      setStartDate(start);
      setStartTime(start);
      setEndTime(end);
      setCalendarId(initialEvent.calendarId || "");
      setCategoryId(initialEvent.categoryId || "");
    } else {
      const now = dayjs();
      setTitle("");
      setDescription("");
      setStartDate(now);
      setStartTime(now);
      setEndTime(now.add(1, "hour"));
      setCalendarId("");
      setCategoryId("");
    }
  }, [initialEvent, open]);

  const handleSave = () => {
    if (!title || !startDate || !startTime || !endTime) return;

    const start = startDate
      .hour(startTime.hour())
      .minute(startTime.minute())
      .second(0)
      .millisecond(0);

    const end = startDate
      .hour(endTime.hour())
      .minute(endTime.minute())
      .second(0)
      .millisecond(0);

    const categoryColor = categories.find((c) => c.id === categoryId)?.color;

    onSave({
      id: initialEvent?.id,
      name: title,
      description,
      calendarId,
      categoryId,
      color: categoryColor,
      startDate: start.toISOString(),
      endDate: end.toISOString()
    });

    onClose();
  };

  return (
    <>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
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
              <MenuItem value="">Brak</MenuItem>
              {calendars.map((cal) => (
                <MenuItem key={cal.id} value={cal.id}>
                  {cal.emoji} {cal.name}
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
              <MenuItem value="">Brak</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  <Box
                    display="inline-block"
                    width={12}
                    height={12}
                    borderRadius={6}
                    bgcolor={cat.color}
                    mr={1}
                  />
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>

            <Divider />

            <Typography variant="body2">Start date</Typography>
            <DateCalendar value={startDate} onChange={setStartDate} />
            <TimePicker
              label="Start time"
              value={startTime}
              onChange={setStartTime}
            />

            <TimePicker
              label="End time"
              value={endTime}
              onChange={setEndTime}
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
