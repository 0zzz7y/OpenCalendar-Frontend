import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  TextField,
  InputLabel,
  FormControl,
  ClickAwayListener,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import type { Event } from "../../types/models";

interface EventCreationDialogProps {
  anchor: { x: number; y: number; dayIndex: number; slotHeight?: number };
  selectedDate: Date;
  initialEvent?: Event;
  onSave: (eventData: {
    name: string;
    date: Date;
    hour: number;
    minute: number;
    calendarId: string;
    category: string;
  }) => void;
  onClose: () => void;
}

export default function EventCreationDialog({
  anchor,
  selectedDate,
  initialEvent,
  onSave,
  onClose,
}: EventCreationDialogProps) {
  const initialDate = initialEvent ? new Date(initialEvent.startDate) : selectedDate;
  const [name, setName] = useState<string>(initialEvent?.name || "");
  const [hour, setHour] = useState<number>(initialDate.getHours());
  const [minute, setMinute] = useState<number>(initialDate.getMinutes());
  const [calendarId, setCalendarId] = useState<string>(initialEvent?.calendarId || "1");
  const [category, setCategory] = useState<string>((initialEvent as any)?.categoryId || "default");
  const [selectedDay, setSelectedDay] = useState<Date>(selectedDate);

  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialEvent) {
      const d = new Date(initialEvent.startDate);
      setName(initialEvent.name);
      setHour(d.getHours());
      setMinute(d.getMinutes());
      setCalendarId(initialEvent.calendarId);
      setCategory((initialEvent as any)?.categoryId || "default");
      setSelectedDay(d);
    }
  }, [initialEvent]);

  const handleSubmit = () => {
    const newDate: Date = new Date(selectedDay);
    newDate.setHours(hour);
    newDate.setMinutes(minute);
    onSave({ name, date: newDate, hour, minute, calendarId, category });
  };

  const dialogWidth = 360;
  const dialogHeight = 420;
  const offset = 12;
  const eventOffset = anchor.slotHeight ?? 25;

  const rightAligned = anchor.dayIndex <= 2;

  let calculatedLeft = rightAligned
    ? anchor.x - dialogWidth - offset
    : anchor.x + dialogWidth / 2 - offset;

  let calculatedTop = anchor.y;
  const fitsTop = (calculatedTop / 2 + dialogHeight <= window.innerHeight)
  const fitsBottom = (calculatedTop / 2 - dialogHeight >= window.innerHeight)

  if (!fitsTop) {
    calculatedTop += dialogHeight
  } else if (!fitsBottom) {
        calculatedTop -= dialogHeight
    }

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Box>
        <Paper
          ref={dialogRef}
          elevation={6}
          sx={{
            position: "fixed",
            top: calculatedTop,
            left: calculatedLeft,
            width: dialogWidth,
            p: 3,
            zIndex: 1500,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            backgroundColor: "background.paper",
          }}
        >
          <TextField
            label="Nazwa wydarzenia"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <DateCalendar value={selectedDay} onChange={(newDay) => newDay && setSelectedDay(newDay)} />

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Godzina</InputLabel>
              <Select
                label="Godzina"
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                MenuProps={{ disablePortal: true }}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <MenuItem key={i} value={i}>
                    {i.toString().padStart(2, "0")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Minuty</InputLabel>
              <Select
                label="Minuty"
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value={0}>00</MenuItem>
                <MenuItem value={30}>30</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth size="small">
            <InputLabel>Kalendarz</InputLabel>
            <Select
              label="Kalendarz"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              MenuProps={{ disablePortal: true }}
            >
              <MenuItem value="1">Osobisty</MenuItem>
              <MenuItem value="2">Praca</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Kategoria</InputLabel>
            <Select
              label="Kategoria"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              MenuProps={{ disablePortal: true }}
            >
              <MenuItem value="default">Brak</MenuItem>
              <MenuItem value="gym">Siłownia</MenuItem>
              <MenuItem value="garden">Ogród</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
            <Button variant="outlined" onClick={onClose} fullWidth>
              Anuluj
            </Button>
            <Button variant="contained" onClick={handleSubmit} fullWidth>
              Zapisz wydarzenie
            </Button>
          </Box>
        </Paper>
      </Box>
    </ClickAwayListener>
  );
}