import React, { useState, useEffect, useCallback } from "react"
import { Box, Typography, IconButton, Stack, Popover, Button } from "@mui/material"
import { Edit, Delete } from "@mui/icons-material"
import dayjs from "dayjs"
import useAppStore from "@/store/useAppStore"
import useEvent from "@/repository/event.repository"
import type Schedulable from "@/model/domain/schedulable"
import BUTTON from "@/constant/ui/button"
import MESSAGE from "@/constant/ui/message"

export interface EventInformationPopoverProps {
  anchorEl: HTMLElement | null
  event: Schedulable | null
  onClose: () => void
  onEdit: () => void
  onDelete: (id: string) => void
}

/**
 * Popover displaying information about a single event,
 * with options to edit or delete.
 */
export default function EventInformationPopover({
  anchorEl,
  event,
  onClose,
  onEdit,
  onDelete
}: EventInformationPopoverProps) {
  const open = Boolean(anchorEl && event)
  const { events: allEvents } = useAppStore()
  const { reloadEvents } = useEvent()

  const [current, setCurrent] = useState<Schedulable | null>(event)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Refresh current event after external updates
  useEffect(() => {
    if (event?.id) {
      ;(async () => {
        await reloadEvents()
        const updated = allEvents.find((e) => e.id === event.id) || null
        setCurrent(updated)
      })()
    }
  }, [event?.id, allEvents, reloadEvents])

  const handleRequestDelete = useCallback(() => setConfirmDelete(true), [])
  const handleCancelDelete = useCallback(() => setConfirmDelete(false), [])

  const handleConfirmDelete = useCallback(() => {
    if (current?.id) {
      onDelete(current.id)
    }
    setConfirmDelete(false)
    onClose()
  }, [current?.id, onDelete, onClose])

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{ sx: { p: 2, width: 300 } }}
    >
      {current && (
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{current.name || MESSAGE.TITLE_REQUIRED}</Typography>
            {!confirmDelete && (
              <Box>
                <IconButton size="small" onClick={onEdit}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleRequestDelete}>
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Stack>

          {!confirmDelete ? (
            <>
              <Typography variant="body2" color="text.secondary">
                {current.startDate && current.endDate
                  ? `${dayjs(current.startDate).format("LLL")} – ${dayjs(current.endDate).format("LLL")}`
                  : MESSAGE.END_AFTER_START}
              </Typography>
              {current.description && <Typography>{current.description}</Typography>}
            </>
          ) : (
            <Stack spacing={1}>
              <Typography variant="body2">{MESSAGE.CONFIRM_DELETE_EVENT}</Typography>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button size="small" color="inherit" onClick={handleCancelDelete}>
                  {BUTTON.CANCEL}
                </Button>
                <Button size="small" color="error" variant="contained" onClick={handleConfirmDelete}>
                  {BUTTON.DELETE}
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
    </Popover>
  )
}
