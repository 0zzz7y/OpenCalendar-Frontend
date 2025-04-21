import useAppContext from "@/hook/context/useAppContext"

import { useEffect, useState } from "react"

import {
  Popover,
  TextField,
  MenuItem,
  Button,
  Stack,
  Divider,
  Typography,
  Box
} from "@mui/material"
import { DateCalendar, TimePicker } from "@mui/x-date-pickers"
import { toast } from "react-toastify"

import Event from "../../type/domain/event"

interface Properties {
  anchorEl: HTMLElement | null
  onClose: () => void
  calendars: { id: string; name: string; emoji: string }[]
  categories: { id: string; name: string; color: string }[]
  initialEvent?: Event
}

const EventCreationPopover = ({
  anchorEl,
  onClose,
  calendars,
  categories,
  initialEvent
}: Properties) => {
  const { updateEvent, addEvent, deleteEvent } = useAppContext()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [start, setStart] = useState<Date>(new Date())
  const [end, setEnd] = useState<Date>(new Date(Date.now() + 60 * 60 * 1000))
  const [calendarId, setCalendarId] = useState("")
  const [categoryId, setCategoryId] = useState("")

  const isValidAnchor = anchorEl && document.body.contains(anchorEl)

  useEffect(() => {
    if (initialEvent) {
      const start = new Date(initialEvent.startDate)
      const end = new Date(initialEvent.endDate)

      setTitle(initialEvent.name)
      setDescription(initialEvent.description || "")
      setStart(start)
      setEnd(end)
      setCalendarId(initialEvent.calendarId || "")
      setCategoryId(initialEvent.categoryId || "")
    } else {
      const now = new Date()
      setTitle("")
      setDescription("")
      setStart(now)
      setEnd(new Date(now.getTime() + 60 * 60 * 1000))
      setCalendarId(calendars[0]?.id || "")
      setCategoryId("")
    }
  }, [initialEvent, open])

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required")
      return
    }

    if (!start || !end || end <= start) {
      toast.error("End time must be after start time")
      return
    }

    const payload = {
      name: title,
      description,
      calendarId,
      categoryId,
      startDate: start.toISOString(),
      endDate: end.toISOString()
    }

    try {
      if (initialEvent?.id) {
        await updateEvent(initialEvent.id, payload)
      } else {
        await addEvent(payload)
      }
      onClose()
    } catch (error) {
      toast.error("Failed to save event")
    }
  }

  const handleDelete = async () => {
    if (initialEvent?.id) {
      try {
        await deleteEvent(initialEvent.id)
        onClose()
      } catch (error) {
        toast.error("Failed to delete event")
      }
    }
  }

  return (
    <Popover
      open={Boolean(isValidAnchor)}
      anchorEl={isValidAnchor ? anchorEl : null}
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

        <Typography variant="body2">Start</Typography>
        <DateCalendar value={start} onChange={(v) => v && setStart(v)} />
        <TimePicker
          label="Start time"
          value={start}
          onChange={(v) => v && setStart(v)}
        />

        <Typography variant="body2">End</Typography>
        <TimePicker
          label="End time"
          value={end}
          onChange={(v) => v && setEnd(v)}
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
          {initialEvent?.id && (
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          )}
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </Stack>
      </Stack>
    </Popover>
  )
}

export default EventCreationPopover
