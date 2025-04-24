import BUTTONS from "@/constant/ui/buttons"
import LABELS from "@/constant/ui/labels"
import MESSAGES from "@/constant/ui/messages"
import useEvent from "@/hook/useEvent"
import RecurringPattern from "@/model/domain/recurringPattern"
import Schedulable from "@/model/domain/schedulable"

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

interface EventCreationPopoverProperties {
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
}: EventCreationPopoverProperties) => {
  const { reloadEvents, updateEvent, addEvent, deleteEvent } = useEvent()

  const isEditMode = Boolean(initialEvent?.id)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [start, setStart] = useState<Date>(new Date())
  const [end, setEnd] = useState<Date>(new Date(Date.now() + 60 * 60 * 1000))
  const [calendarId, setCalendarId] = useState("")
  const [categoryId, setCategoryId] = useState("")

  const isValidAnchor = anchorEl && document.body.contains(anchorEl)

  useEffect(() => {
    if (isEditMode && initialEvent) {
      setTitle(initialEvent.name || "")
      setDescription(initialEvent.description || "")
      setStart(new Date(initialEvent.startDate || new Date()))
      setEnd(new Date(initialEvent.endDate || new Date()))
      setCalendarId(initialEvent.calendar?.id || "")
      setCategoryId(initialEvent.category?.id || "")
    } else {
      const now = new Date()
      setTitle("")
      setDescription("")
      setStart(now)
      setEnd(new Date(now.getTime() + 60 * 60 * 1000))
      setCalendarId(calendars[0]?.id || "")
      setCategoryId("")
    }
  }, [initialEvent, anchorEl, isEditMode])

  const handleSave = async () => {
    if (!title.trim()) return toast.error("Title is required")
    if (!start || !end || end <= start) return toast.error("End must be after start")

    const calendar = calendars.find((c) => c.id === calendarId)
    if (!calendar) return toast.error("Calendar is required")

    const category = categories.find((c) => c.id === categoryId)

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
      if (isEditMode && initialEvent?.id) {
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
    if (isEditMode && initialEvent?.id) {
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
          {isEditMode ? MESSAGES.EDIT_EVENT : MESSAGES.ADD_EVENT}
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

          {isEditMode && (
            <Button onClick={handleDelete} color="error">
              {BUTTONS.DELETE}
            </Button>
          )}

          <Button onClick={handleSave} variant="contained">
            {BUTTONS.SAVE}
          </Button>
        </Stack>
      </Stack>
    </Popover>
  )
}

export default EventCreationPopover