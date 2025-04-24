import BUTTONS from "@/constant/ui/buttons"
import MESSAGES from "@/constant/ui/messages"
import useEvent from "@/repository/event.repository"
import Schedulable from "@/model/domain/schedulable"

import { useEffect, useState } from "react"

import { Edit, Delete } from "@mui/icons-material"
import { Box, Typography, IconButton, Stack, Popover, Button } from "@mui/material"
import useAppStore from "@/store/useAppStore"

interface EventInformationPopoverProperties {
  anchorElement: HTMLElement | null
  event: Schedulable | null
  onClose: () => void
  onEdit: () => void
  onDelete: (eventId: string) => void
}

const EventInformationPopover = ({
  anchorElement,
  event,
  onClose,
  onEdit,
  onDelete
}: EventInformationPopoverProperties) => {
  const open = Boolean(anchorElement && event)
  const { events } = useAppStore()
  const { reloadEvents } = useEvent()

  const [currentEvent, setCurrentEvent] = useState<Schedulable | null>(event)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const handleDeleteClick = () => setConfirmingDelete(true)

  const handleConfirmDelete = () => {
    if (event) onDelete(event.id)
    setConfirmingDelete(false)
    onClose()
  }

  const handleCancelDelete = () => setConfirmingDelete(false)

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

  return (
    <Popover
      open={open}
      anchorEl={anchorElement}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{ sx: { p: 2, width: 300 } }}
    >
      {currentEvent && (
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">{currentEvent.name || "Untitled"}</Typography>
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
                {currentEvent.startDate && currentEvent.endDate
                  ? `${new Date(currentEvent.startDate).toLocaleString()} – ${new Date(
                      currentEvent.endDate
                    ).toLocaleString()}`
                  : "No date available"}
              </Typography>

              {currentEvent.description && <Typography>{currentEvent.description}</Typography>}
            </>
          ) : (
            <Stack spacing={1}>
              <Typography variant="body2">{MESSAGES.CONFIRM_DELETE_EVENT}</Typography>

              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button onClick={handleCancelDelete} size="small" color="inherit">
                  {BUTTONS.CANCEL}
                </Button>
                <Button onClick={handleConfirmDelete} size="small" color="error">
                  {BUTTONS.DELETE}
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
