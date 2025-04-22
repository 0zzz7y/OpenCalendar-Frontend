import BUTTONS from "@/constant/buttons"
import LABELS from "@/constant/labels"
import MESSAGES from "@/constant/messages"
import useEvent from "@/hook/api/useEvent"
import useTask from "@/hook/api/useTask"
import RecurringPattern from "@/type/domain/recurringPattern"
import Schedulable from "@/type/domain/schedulable"

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
import dayjs from "dayjs"
import { toast } from "react-toastify"

interface Properties {
  anchorEl: HTMLElement | null
  calendars: { id: string; name: string; emoji: string }[]
  categories: { id: string; name: string; color: string }[]
  initialEvent?: Schedulable
  onClose: () => void
}

const EventCreationPopover = ({
  anchorEl,
  calendars,
  categories,
  initialEvent,
  onClose
}: Properties) => {
  const { reloadEvents, updateEvent, addEvent, deleteEvent } = useEvent()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [start, setStart] = useState<Date>(new Date())
  const [end, setEnd] = useState<Date>(new Date(Date.now() + 60 * 60 * 1000))
  const [calendarId, setCalendarId] = useState("")
  const [categoryId, setCategoryId] = useState("")

  const isValidAnchor = anchorEl && document.body.contains(anchorEl)

  useEffect(() => {
    if (initialEvent) {
      const title: string = initialEvent.name || ""
      const description: string = initialEvent.description || ""
      const startDate: Date = new Date(initialEvent.startDate || new Date())
      const endDate: Date = new Date(initialEvent.endDate || new Date())
      const calendarId: string = initialEvent.calendar?.id || ""
      const categoryId: string = initialEvent.category?.id || ""

      setTitle(title)
      setDescription(description)
      setStart(startDate)
      setEnd(endDate)
      setCalendarId(calendarId)
      setCategoryId(categoryId)
    } else {
      const title: string = ""
      const description: string = ""
      const startDate: Date = new Date()
      const endDate: Date = new Date(startDate.getTime() + 60 * 60 * 1000)
      const calendarId: string = calendars[0]?.id || ""
      const categoryId: string = ""

      setTitle(title)
      setDescription(description)
      setStart(startDate)
      setEnd(endDate)
      setCalendarId(calendarId)
      setCategoryId(categoryId)
    }
  }, [initialEvent, anchorEl])

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required")
      return
    }

    if (!start || !end || end <= start) {
      toast.error("End time must be after start time")
      return
    }

    const calendar = calendars.find((c) => c.id === calendarId)
    const category = categories.find((c) => c.id === categoryId)

    if (!calendar) {
      toast.error("Calendar is required")
      return
    }

    const payload = {
      name: title,
      description,
      startDate: dayjs(start).format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs(end).format("YYYY-MM-DDTHH:mm:ss"),
      recurringPattern: RecurringPattern.NONE,
      calendar,
      category
    }

    try {
      if (initialEvent?.id) {
        await updateEvent(initialEvent.id, payload)
      } else {
        await addEvent(payload)
      }
      toast.success("Event saved successfully")
      reloadEvents()
      onClose()
    } catch (error) {
      toast.error("Failed to save event")
    }
  }

  const handleDelete = async () => {
    if (initialEvent?.id) {
      try {
        await deleteEvent(initialEvent.id)
        toast.success("Event deleted successfully")
        reloadEvents()
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
          {initialEvent ? MESSAGES.EDIT_EVENT : MESSAGES.ADD_EVENT}
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
          <MenuItem value="">None</MenuItem>
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

        <Typography variant="body2">{LABELS.START_DATE}</Typography>

        <DateCalendar value={start} onChange={(v) => v && setStart(v)} />

        <TimePicker
          label={LABELS.START_TIME}
          value={start}
          onChange={(v) => v && setStart(v)}
        />

        <Typography variant="body2">End</Typography>
        <TimePicker
          label={LABELS.END_TIME}
          value={end}
          onChange={(v) => v && setEnd(v)}
        />

        <TextField
          label={LABELS.DESCRIPTION}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          minRows={2}
        />

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button onClick={onClose} color="inherit">
            {BUTTONS.CANCEL}
          </Button>

          <Button onClick={handleSave} variant="contained">
            {BUTTONS.SAVE}
          </Button>
        </Stack>
      </Stack>
    </Popover>
  )
}

export default EventCreationPopover
