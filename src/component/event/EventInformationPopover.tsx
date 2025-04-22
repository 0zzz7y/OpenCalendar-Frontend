import useAppContext from "@/hook/context/useAppContext"
import Event from "@/type/domain/event"

import { useEffect, useState } from "react"

import { Edit, Delete } from "@mui/icons-material"
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Popover,
  Button
} from "@mui/material"

interface Properties {
  anchorEl: HTMLElement | null
  event: Event | null
  onClose: () => void
  onEdit: () => void
  onDelete: (eventId: string) => void
}

const EventInformationPopover = ({
  anchorEl,
  event,
  onClose,
  onEdit,
  onDelete
}: Properties) => {
  const open = Boolean(anchorEl && event)
  const { events, reloadEvents } = useAppContext()

  const [currentEvent, setCurrentEvent] = useState<Event | null>(event)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    const refresh = async () => {
      await reloadEvents()
      if (event?.id) {
        const updated = events.find((e) => e.id === event.id)
        if (updated) setCurrentEvent(updated)
      }
    }

    if (event?.id) refresh()
  }, [event?.id, events])

  const handleDeleteClick = () => setConfirmingDelete(true)
  const handleConfirmDelete = () => {
    if (event) onDelete(event.id)
    setConfirmingDelete(false)
    onClose()
  }
  const handleCancelDelete = () => setConfirmingDelete(false)

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{ sx: { p: 2, width: 300 } }}
    >
      {currentEvent && (
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">{currentEvent.name}</Typography>
            <Box>
              {!confirmingDelete && (
                <>
                  <IconButton size="small" onClick={onEdit}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={handleDeleteClick}>
                    <Delete fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>
          </Stack>

          {!confirmingDelete ? (
            <>
              <Typography variant="body2" color="text.secondary">
                {new Date(currentEvent.startDate).toLocaleString()} –{" "}
                {new Date(currentEvent.endDate).toLocaleString()}
              </Typography>
              {currentEvent.description && (
                <Typography>{currentEvent.description}</Typography>
              )}
            </>
          ) : (
            <Stack spacing={1}>
              <Typography variant="body2">
                Czy na pewno chcesz usunąć to wydarzenie?
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  onClick={handleCancelDelete}
                  size="small"
                  color="inherit"
                >
                  Anuluj
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  size="small"
                  color="error"
                >
                  Usuń
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
    </Popover>
  )
}

export default EventInformationPopover
