import { useState, useEffect, useCallback } from "react"
import { Popover, TextField, MenuItem, Stack, Divider, Typography, Box } from "@mui/material"
import { DateCalendar, TimePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { toast } from "react-toastify"

import { useEvent } from "@/features/event/useEvent.hook"
import { RecurringPattern } from "@/features/event/recurringPattern.type"
import type { Event } from "@/features/event/event.model"

import { LABEL } from "@/components/shared/label.constant"
import { MESSAGE } from "@/components/shared/message.constant"
import { Filter } from "@/features/filter/filter.type"
import { SaveButton } from "@/components/library/button/SaveButton"
import { CancelButton } from "@/components/library/button/CancelButton"
import { useStorage } from "@/storage/useStorage.hook"

import type { Calendar } from "@/features/calendar/calendar.model"
import type { Category } from "@/features/category/category.model"

export interface EventCreationPopoverProps {
  anchorEl: HTMLElement | null
  calendars: Calendar[]
  categories: Category[]
  initialEvent?: Event
  clickedDatetime?: Date
  onClose: () => void
}

interface FormState {
  name: string
  description: string
  calendarId: string
  categoryId: string
  start: Date
  end: Date
  recurringPattern: RecurringPattern
}

export default function EventCreationPopover({
  anchorEl,
  calendars,
  categories,
  initialEvent,
  clickedDatetime,
  onClose
}: EventCreationPopoverProps) {
  const { addEvent, updateEvent, reloadEvents } = useEvent()
  const { events } = useStorage()

  const isEdit = Boolean(initialEvent?.id)
  const validAnchor = Boolean(anchorEl && document.body.contains(anchorEl))

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    calendarId: calendars[0]?.id || "",
    categoryId: "",
    start: clickedDatetime || new Date(),
    end: new Date((clickedDatetime?.getTime() || Date.now()) + 3600_000),
    recurringPattern: RecurringPattern.NONE
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    name: false,
    calendarId: false,
    endDate: false,
    description: false
  })

  useEffect(() => {
    if (!validAnchor) return

    if (isEdit && initialEvent) {
      setForm({
        name: initialEvent.name || "",
        description: initialEvent.description || "",
        calendarId: initialEvent.calendar?.id || "",
        categoryId: initialEvent.category?.id || "",
        start: new Date(initialEvent.startDate),
        end: new Date(initialEvent.endDate),
        recurringPattern: initialEvent.recurringPattern || RecurringPattern.NONE
      })
    } else if (clickedDatetime && calendars.length > 0) {
      setForm((prev) => ({
        ...prev,
        calendarId: calendars[0].id,
        start: clickedDatetime,
        end: new Date(clickedDatetime.getTime() + 3600_000)
      }))
    }
  }, [validAnchor, isEdit, initialEvent, clickedDatetime, calendars])

  const handleChange = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value }

      if (field === "start") {
        const s = value as Date
        const e = new Date(updated.end)
        e.setFullYear(s.getFullYear(), s.getMonth(), s.getDate())
        updated.end = e
      } else if (field === "end") {
        const s = new Date(updated.start)
        const e = value as Date
        e.setFullYear(s.getFullYear(), s.getMonth(), s.getDate())
        updated.end = e
      }

      return updated
    })
    setErrors((prev) => ({ ...prev, [field]: false }))
  }, [])

  const validateForm = useCallback(() => {
    const newErrors = {
      name: !form.name.trim(),
      calendarId: !form.calendarId,
      endDate: form.end <= form.start,
      description: form.description.length > 4096
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }, [form])

  const handleSave = useCallback(async () => {
    if (!form.calendarId) {
      toast.error(MESSAGE.CALENDAR_REQUIRED)
      return
    }
    if (!validateForm()) return

    const calendar = calendars.find((c) => c.id === form.calendarId)
    const category = categories.find((c) => c.id === form.categoryId)

    const payload = {
      name: form.name,
      description: form.description,
      startDate: dayjs(form.start).format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs(form.end).format("YYYY-MM-DDTHH:mm:ss"),
      recurringPattern: form.recurringPattern,
      calendar: calendar ? { ...calendar, name: calendar.name } : undefined,
      category: category ? { ...category, name: category.name } : undefined
    }

    setLoading(true)
    try {
      if (isEdit && initialEvent?.id) {
        if (!initialEvent.id) {
          await updateEvent({ id: initialEvent.id, ...payload })
        } else {
          const original = events.find((e) => e.id === initialEvent.id)
          if (!original) {
            toast.error("Original event not found.")
            return
          }

          const updated = { ...payload }

          if (
            dayjs(form.start).format("HH:mm") !== dayjs(original.startDate).format("HH:mm") ||
            dayjs(form.end).format("HH:mm") !== dayjs(original.endDate).format("HH:mm")
          ) {
            updated.startDate = dayjs(original.startDate)
              .hour(dayjs(form.start).hour())
              .minute(dayjs(form.start).minute())
              .format("YYYY-MM-DDTHH:mm:ss")

            updated.endDate = dayjs(original.endDate)
              .hour(dayjs(form.end).hour())
              .minute(dayjs(form.end).minute())
              .format("YYYY-MM-DDTHH:mm:ss")
          }

          await updateEvent({ id: original.id, ...updated })
        }
      } else {
        await addEvent(payload)
      }

      reloadEvents()
      onClose()
    } catch {
    } finally {
      setLoading(false)
    }
  }, [
    form,
    isEdit,
    initialEvent,
    updateEvent,
    addEvent,
    reloadEvents,
    onClose,
    validateForm,
    calendars,
    categories,
    events
  ])

  return (
    <Popover
      open={validAnchor}
      anchorEl={validAnchor ? anchorEl : null}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{ sx: { p: 2, width: 340, maxHeight: "90vh", overflowY: "auto" } }}
    >
      <Stack spacing={2}>
        <Typography variant="h6">{isEdit ? MESSAGE.EDIT_EVENT : MESSAGE.ADD_EVENT}</Typography>

        <TextField
          label={LABEL.NAME}
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          fullWidth
          error={errors.name}
          helperText={errors.name ? MESSAGE.FIELD_REQUIRED : ""}
        />

        <TextField
          label={LABEL.CALENDAR}
          select
          value={form.calendarId}
          onChange={(e) => handleChange("calendarId", e.target.value)}
          fullWidth
          error={errors.calendarId}
          helperText={errors.calendarId ? MESSAGE.FIELD_REQUIRED : ""}
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
          <MenuItem value="">{Filter.NONE}</MenuItem>
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
        <TimePicker
          label={LABEL.END_TIME}
          value={form.end}
          onChange={(d) => d && handleChange("end", d)}
          slotProps={{
            textField: {
              error: errors.endDate,
              helperText: errors.endDate ? MESSAGE.END_DATE_BEFORE_START_DATE : ""
            }
          }}
        />

        <TextField
          label={LABEL.RECURRING}
          select
          value={form.recurringPattern}
          onChange={(e) => handleChange("recurringPattern", e.target.value as RecurringPattern)}
          fullWidth
        >
          {Object.values(RecurringPattern).map((pattern) => (
            <MenuItem key={pattern} value={pattern}>
              {pattern.charAt(0) + pattern.slice(1).toLowerCase()}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label={LABEL.DESCRIPTION}
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          fullWidth
          multiline
          minRows={2}
          error={errors.description}
          helperText={errors.description ? MESSAGE.DESCRIPTION_TOO_LONG : ""}
        />

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <CancelButton onClick={onClose} />
          <SaveButton onClick={handleSave} loading={loading} />
        </Stack>
      </Stack>
    </Popover>
  )
}
