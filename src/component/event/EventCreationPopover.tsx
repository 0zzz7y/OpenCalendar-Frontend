import React, { useState, useEffect, useCallback } from "react"
import { Popover, TextField, MenuItem, Button, Stack, Divider, Typography, Box } from "@mui/material"
import { DateCalendar, TimePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { toast } from "react-toastify"

import useEvent from "@/repository/event.repository"
import RecurringPattern from "@/model/domain/recurringPattern"
import type Schedulable from "@/model/domain/schedulable"
import BUTTON from "@/constant/ui/button"
import LABEL from "@/constant/ui/label"
import MESSAGE from "@/constant/ui/message"
import FILTER from "@/constant/utility/filter"

export interface EventCreationPopoverProps {
  anchorEl: HTMLElement | null
  calendars: { id: string; name: string; emoji: string }[]
  categories: { id: string; name: string; color: string }[]
  initialEvent?: Schedulable
  onClose: () => void
}

interface FormState {
  title: string
  description: string
  calendarId: string
  categoryId: string
  start: Date
  end: Date
}

/**
 * Popover for creating or editing an event.
 */
export default function EventCreationPopover({
  anchorEl,
  calendars,
  categories,
  initialEvent,
  onClose
}: EventCreationPopoverProps) {
  const { reloadEvents, updateEvent, addEvent, deleteEvent } = useEvent()
  const isEdit = Boolean(initialEvent?.id)

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    calendarId: "",
    categoryId: "",
    start: new Date(),
    end: new Date(Date.now() + 3600_000)
  })

  const validAnchor = Boolean(anchorEl && document.body.contains(anchorEl))

  // Sync initial data when popover opens
  useEffect(() => {
    if (validAnchor) {
      if (isEdit && initialEvent) {
        setForm({
          title: initialEvent.name || "",
          description: initialEvent.description || "",
          calendarId: initialEvent.calendar?.id || "",
          categoryId: initialEvent.category?.id || "",
          start: new Date(initialEvent.startDate || Date.now()),
          end: new Date(initialEvent.endDate || Date.now())
        })
      } else if (calendars.length > 0) {
        const now = new Date()
        setForm({
          title: "",
          description: "",
          calendarId: calendars[0].id,
          categoryId: "",
          start: now,
          end: new Date(now.getTime() + 3600_000)
        })
      }
    }
  }, [validAnchor, isEdit, initialEvent, calendars])

  const handleChange = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSave = useCallback(async () => {
    // Validation
    if (!form.title.trim()) {
      toast.error(MESSAGE.TITLE_REQUIRED)
      return
    }
    if (form.end <= form.start) {
      toast.error(MESSAGE.END_AFTER_START)
      return
    }
    const calendar = calendars.find((c) => c.id === form.calendarId)
    if (!calendar) {
      toast.error(MESSAGE.CALENDAR_REQUIRED)
      return
    }

    const payload = {
      name: form.title,
      description: form.description,
      startDate: dayjs(form.start).format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs(form.end).format("YYYY-MM-DDTHH:mm:ss"),
      recurringPattern: RecurringPattern.NONE,
      calendar,
      category: categories.find((c) => c.id === form.categoryId) || undefined
    }

    try {
      if (isEdit && initialEvent?.id) {
        // Update existing event with id included in payload
        await updateEvent({ id: initialEvent.id, ...payload })
        toast.success(MESSAGE.EVENT_UPDATED_SUCCESSFULLY)
      } else {
        // Create new event
        await addEvent(payload)
        toast.success(MESSAGE.EVENT_CREATED_SUCCESSFULLY)
      }
      reloadEvents()
      onClose()
    } catch {
      toast.error(MESSAGE.EVENT_SAVE_FAILED)
    }
  }, [form, calendars, categories, isEdit, initialEvent, updateEvent, addEvent, reloadEvents, onClose])

  const handleDelete = useCallback(async () => {
    if (isEdit && initialEvent?.id) {
      try {
        await deleteEvent(initialEvent.id)
        toast.success(MESSAGE.EVENT_DELETED_SUCCESSFULLY)
        reloadEvents()
        onClose()
      } catch {
        toast.error(MESSAGE.EVENT_DELETE_FAILED)
      }
    }
  }, [isEdit, initialEvent, deleteEvent, reloadEvents, onClose])

  return (
    <Popover
      open={validAnchor}
      anchorEl={validAnchor ? anchorEl : null}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        sx: { p: 2, width: 340, maxHeight: "90vh", overflowY: "auto" }
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6">{isEdit ? MESSAGE.EDIT_EVENT : MESSAGE.ADD_EVENT}</Typography>

        <TextField
          label={LABEL.NAME}
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          fullWidth
        />

        <TextField
          label={LABEL.CALENDAR}
          select
          value={form.calendarId}
          onChange={(e) => handleChange("calendarId", e.target.value)}
          fullWidth
        >
          {calendars.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.emoji} {c.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label={LABEL.CATEGORY}
          select
          value={form.categoryId}
          onChange={(e) => handleChange("categoryId", e.target.value)}
          fullWidth
        >
          <MenuItem value="">{FILTER.NONE}</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              <Box display="inline-block" width={12} height={12} borderRadius={6} bgcolor={c.color} mr={1} />
              {c.name}
            </MenuItem>
          ))}
        </TextField>

        <Divider />

        <Typography variant="body2">{LABEL.START_DATE}</Typography>
        <DateCalendar value={form.start} onChange={(d) => d && handleChange("start", d)} />
        <TimePicker label={LABEL.START_TIME} value={form.start} onChange={(d) => d && handleChange("start", d)} />
        <TimePicker label={LABEL.END_TIME} value={form.end} onChange={(d) => d && handleChange("end", d)} />

        <TextField
          label={LABEL.DESCRIPTION}
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          fullWidth
          multiline
          minRows={2}
        />

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button onClick={onClose} color="inherit">
            {BUTTON.CANCEL}
          </Button>
          {isEdit && (
            <Button onClick={handleDelete} color="error">
              {BUTTON.DELETE}
            </Button>
          )}
          <Button variant="contained" onClick={handleSave}>
            {BUTTON.SAVE}
          </Button>
        </Stack>
      </Stack>
    </Popover>
  )
}
