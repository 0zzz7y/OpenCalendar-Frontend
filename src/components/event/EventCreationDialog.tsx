import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  Box,
} from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { useState, useEffect } from "react"
import { useCalendars } from "@/hooks/useCalendars"
import { useCategories } from "@/hooks/useCategories"
import { Event } from "@/models/event"

interface Properties {
  open: boolean
  onClose: () => void
  onSave?: (event: Partial<Event>) => void
  initialDate: Date
  initialEvent?: Event
}

const EventCreationDialog = ({ open, onClose, onSave, initialDate, initialEvent }: Properties) => {
  const { calendars } = useCalendars()
  const { categories } = useCategories()

  const [title, setTitle] = useState("")
  const [start, setStart] = useState<Date>(initialDate)
  const [end, setEnd] = useState<Date>(new Date(initialDate.getTime() + 60 * 60 * 1000))
  const [calendarId, setCalendarId] = useState("")
  const [categoryId, setCategoryId] = useState<string | undefined>()

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title)
      setStart(new Date(initialEvent.startDate))
      setEnd(new Date(initialEvent.endDate))
      setCalendarId(initialEvent.calendarId)
      setCategoryId(initialEvent.categoryId)
    }
  }, [initialEvent])

  const handleSave = () => {
    if (!title.trim() || !calendarId) return

    const eventData: Partial<Event> = {
      id: initialEvent?.id ?? crypto.randomUUID(),
      title,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      calendarId,
      categoryId,
    }

    onSave?.(eventData)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialEvent ? "Edit Event" : "Create Event"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          <DateTimePicker
            label="Start Date"
            value={start}
            onChange={(date) => date && setStart(date)}
          />

          <DateTimePicker
            label="End Date"
            value={end}
            onChange={(date) => date && setEnd(date)}
          />

          <TextField
            label="Calendar"
            select
            fullWidth
            value={calendarId}
            onChange={(e) => setCalendarId(e.target.value)}
          >
            {calendars.map((calendar) => (
              <MenuItem key={calendar.id} value={calendar.id}>
                {calendar.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Category"
            select
            fullWidth
            value={categoryId || ""}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.emoji} {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          {initialEvent ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EventCreationDialog
