import React, { useState, useEffect, useCallback } from "react";
import { Popover, TextField, MenuItem, Stack, Divider, Typography, Box } from "@mui/material";
import { DateCalendar, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import useEvent from "@/repository/event.repository";
import RecurringPattern from "@/model/domain/recurringPattern";
import type Schedulable from "@/model/domain/schedulable";
import BUTTON from "@/constant/ui/button";
import LABEL from "@/constant/ui/label";
import MESSAGE from "@/constant/ui/message";
import FILTER from "@/constant/utility/filter";
import SaveButton from "@/component/common/button/SaveButton";
import CancelButton from "@/component/common/button/CancelButton";

export interface EventCreationPopoverProps {
  anchorEl: HTMLElement | null;
  calendars: { id: string; name: string; emoji: string }[];
  categories: { id: string; name: string; color: string }[];
  initialEvent?: Schedulable;
  clickedDatetime?: Date;
  onClose: () => void;
}

interface FormState {
  title: string;
  description: string;
  calendarId: string;
  categoryId: string;
  start: Date;
  end: Date;
}

export default function EventCreationPopover({
  anchorEl,
  calendars,
  categories,
  initialEvent,
  clickedDatetime,
  onClose,
}: EventCreationPopoverProps) {
  const { reloadEvents, updateEvent, addEvent } = useEvent();
  const isEdit = Boolean(initialEvent?.id);

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    calendarId: "",
    categoryId: "",
    start: clickedDatetime || new Date(), // Use clickedDatetime for the start date
    end: new Date((clickedDatetime ? clickedDatetime.getTime() : Date.now()) + 3600_000), // Default to 1 hour later
  });

  const [loading, setLoading] = useState(false); // Loading state for buttons
  const [errors, setErrors] = useState({
    title: false,
    calendarId: false,
    endDate: false,
    description: false,
  });

  const validAnchor = Boolean(anchorEl && document.body.contains(anchorEl));

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
          end: new Date(initialEvent.endDate || Date.now()),
        });
      } else if (clickedDatetime && calendars.length > 0) {
        setForm({
          title: "",
          description: "",
          calendarId: calendars[0].id,
          categoryId: "",
          start: clickedDatetime,
          end: new Date(clickedDatetime.getTime() + 3600_000),
        });
      }
    }
  }, [validAnchor, isEdit, initialEvent, clickedDatetime, calendars]);

  const handleChange = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false })); // Reset error for the field
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {
      title: !form.title.trim(),
      calendarId: !form.calendarId,
      endDate: form.end <= form.start,
      description: form.description.length > 4096,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  }, [form]);

  const handleSave = useCallback(async () => {
    if (!form.calendarId) {
      toast.error("Cannot create event. No calendar is available.");
      return;
    }

    if (!validateForm()) return;

    const payload = {
      name: form.title,
      description: form.description,
      startDate: dayjs(form.start).format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs(form.end).format("YYYY-MM-DDTHH:mm:ss"),
      recurringPattern: RecurringPattern.NONE,
      calendar: calendars.find((c) => c.id === form.calendarId),
      category: categories.find((c) => c.id === form.categoryId) || undefined,
    };

    setLoading(true);
    try {
      if (isEdit && initialEvent?.id) {
        await updateEvent({ id: initialEvent.id, ...payload });
      } else {
        await addEvent(payload);
      }
      reloadEvents();
      onClose();
    } catch {
      toast.error("Failed to create event.");
    } finally {
      setLoading(false);
    }
  }, [form, calendars, categories, isEdit, initialEvent, updateEvent, addEvent, reloadEvents, onClose, validateForm]);

  return (
    <Popover
      open={validAnchor}
      anchorEl={validAnchor ? anchorEl : null}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        sx: { p: 2, width: 340, maxHeight: "90vh", overflowY: "auto" },
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6">{isEdit ? MESSAGE.EDIT_EVENT : MESSAGE.ADD_EVENT}</Typography>

        <TextField
          label={LABEL.NAME}
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          fullWidth
          error={errors.title}
          helperText={errors.title ? MESSAGE.FIELD_REQUIRED : ""}
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
        <TimePicker
          label={LABEL.START_TIME}
          value={form.start}
          onChange={(d) => d && handleChange("start", d)}
        />
        <TimePicker
          label={LABEL.END_TIME}
          value={form.end}
          onChange={(d) => d && handleChange("end", d)}
          slotProps={{
            textField: {
              error: errors.endDate,
              helperText: errors.endDate ? MESSAGE.END_DATE_BEFORE_START_DATE : "",
            },
          }}
        />

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
  );
}
