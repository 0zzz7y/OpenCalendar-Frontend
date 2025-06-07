/**
 * Copyright (c) Tomasz Wnuk
 */

import { useState, useEffect, useCallback } from "react"
import { Popover, TextField, MenuItem, Stack, Divider, Typography, Box } from "@mui/material"
import { DateCalendar, TimePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { toast } from "react-toastify"

import useEvent from "@/repository/event.repository"
import RecurringPattern from "@/model/domain/recurringPattern"
import type Schedulable from "@/model/domain/schedulable"
import LABEL from "@/constant/ui/label"
import MESSAGE from "@/constant/ui/message"
import FILTER from "@/constant/utility/filter"
import SaveButton from "@/component/common/button/SaveButton"
import CancelButton from "@/component/common/button/CancelButton"
import useApplicationStorage from "@/storage/useApplicationStorage"
import type Calendar from "@/model/domain/calendar"
import type Category from "@/model/domain/category"

export interface EventCreationPopoverProps {
  anchorEl: HTMLElement | null
  calendars: Calendar[]
  categories: Category[]
  initialEvent?: Schedulable
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
  const { reloadEvents, updateEvent, addEvent } = useEvent()
  const isEdit = Boolean(initialEvent?.id)
  const { events } = useApplicationStorage()

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    calendarId: "",
    categoryId: "",
    start: clickedDatetime || new Date(),
    end: new Date((clickedDatetime ? clickedDatetime.getTime() : Date.now()) + 3600_000),
    recurringPattern: RecurringPattern.NONE
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    name: false,
    calendarId: false,
    endDate: false,
    description: false
  })

  const validAnchor = Boolean(anchorEl && document.body.contains(anchorEl))

  useEffect(() => {
    if (validAnchor) {
      if (isEdit && initialEvent) {
        setForm({
          name: initialEvent.name || "",
          description: initialEvent.description || "",
          calendarId: initialEvent.calendar?.id || "",
          categoryId: initialEvent.category?.id || "",
          start: new Date(initialEvent.startDate || Date.now()),
          end: new Date(initialEvent.endDate || Date.now()),
          recurringPattern: initialEvent.recurringPattern || RecurringPattern.NONE
        })
      } else if (clickedDatetime && calendars.length > 0) {
        setForm({
          name: "",
          description: "",
          calendarId: calendars[0].id,
          categoryId: "",
          start: clickedDatetime,
          end: new Date(clickedDatetime.getTime() + 3600_000),
          recurringPattern: RecurringPattern.NONE
        })
      }
    }
  }, [validAnchor, isEdit, initialEvent, clickedDatetime, calendars])

  const handleChange = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => {
      const updatedForm = { ...prev, [field]: value }

      if (field === "start") {
        const start = value as Date
        const end = new Date(updatedForm.end)

        end.setFullYear(start.getFullYear(), start.getMonth(), start.getDate())
        updatedForm.end = end
      } else if (field === "end") {
        const start = new Date(updatedForm.start)
        const end = value as Date

        end.setFullYear(start.getFullYear(), start.getMonth(), start.getDate())
        updatedForm.end = end
      }

      return updatedForm
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
    return !Object.values(newErrors).some((error) => error)
  }, [form])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleSave = useCallback(async () => {
    if (!form.calendarId) {
      toast.error("Cannot create or edit event. No calendar is selected.")
      return
    }

    if (!validateForm()) return

    const payload = {
      name: form.name,
      description: form.description,
      startDate: dayjs(form.start).format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs(form.end).format("YYYY-MM-DDTHH:mm:ss"),
      recurringPattern: form.recurringPattern,
      calendar: calendars.find((c) => c.id === form.calendarId)
        ? (() => {
            const calendar = calendars.find((c) => c.id === form.calendarId)
            return calendar ? { ...calendar, name: calendar.name } : undefined
          })()
        : undefined,
      category: categories.find((c) => c.id === form.categoryId)
        ? (() => {
            const category = categories.find((c) => c.id === form.categoryId)
            return category ? { ...category, name: category.name } : undefined
          })()
        : undefined
    }

    setLoading(true)
    try {
      if (isEdit && initialEvent?.id !== undefined) {
        if (initialEvent.id === initialEvent.originalEventId || !initialEvent.originalEventId) {
          console.log("Editing the original event")
          await updateEvent({ id: initialEvent.id, ...payload })
        } else {
          console.log("Editing a copy of the event")
          const originalEvent = events.find((e) => e.id === initialEvent.originalEventId)

          if (originalEvent) {
            const basePayload = {
              name: originalEvent.name,
              description: originalEvent.description,
              startDate: dayjs(originalEvent.startDate).format("YYYY-MM-DDTHH:mm:ss"),
              endDate: dayjs(originalEvent.endDate).format("YYYY-MM-DDTHH:mm:ss"),
              recurringPattern: originalEvent.recurringPattern,
              calendar: originalEvent.calendar,
              category: originalEvent.category || undefined
            }

            const updatedPayload = { ...basePayload }

            if (form.name !== originalEvent.name) {
              updatedPayload.name = form.name
            }
            if (form.description !== originalEvent.description) {
              updatedPayload.description = form.description
            }
            if (form.calendarId !== originalEvent.calendar?.id) {
              const selectedCalendar = calendars.find((c) => c.id === form.calendarId)
              if (selectedCalendar) {
                updatedPayload.calendar = { ...selectedCalendar, name: selectedCalendar.name }
              }
            }
            if (form.categoryId !== (originalEvent.category?.id || "")) {
              updatedPayload.category = categories.find((c) => c.id === form.categoryId)
                ? (() => {
                    const category = categories.find((c) => c.id === form.categoryId)
                    return category ? { ...category, name: category.name } : undefined
                  })()
                : undefined
            }
            if (
              dayjs(form.start).format("HH:mm") !== dayjs(originalEvent.startDate).format("HH:mm") ||
              dayjs(form.end).format("HH:mm") !== dayjs(originalEvent.endDate).format("HH:mm")
            ) {
              const originalStart = dayjs(originalEvent.startDate)
              const originalEnd = dayjs(originalEvent.endDate)
              const newStartTime = dayjs(form.start)
              const newEndTime = dayjs(form.end)

              const updatedStartDate = originalStart
                .hour(newStartTime.hour())
                .minute(newStartTime.minute())
                .second(newStartTime.second())

              const updatedEndDate = originalEnd
                .hour(newEndTime.hour())
                .minute(newEndTime.minute())
                .second(newEndTime.second())

              updatedPayload.startDate = updatedStartDate.format("YYYY-MM-DDTHH:mm:ss")
              updatedPayload.endDate = updatedEndDate.format("YYYY-MM-DDTHH:mm:ss")
            }
            if (form.recurringPattern !== originalEvent.recurringPattern) {
              updatedPayload.recurringPattern = form.recurringPattern
            }

            console.log("Updated full payload:", updatedPayload)

            await updateEvent({ id: originalEvent.id, ...updatedPayload })
          } else {
            toast.error("Original event not found.")
          }
        }
      } else {
        await addEvent(payload)
      }

      reloadEvents()
      onClose()
    } catch {
      toast.error("Failed to save event.")
    } finally {
      setLoading(false)
    }
  }, [form, calendars, categories, isEdit, initialEvent, updateEvent, addEvent, reloadEvents, onClose, validateForm])

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
