import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button
} from "@mui/material";

import { useState } from "react";

import Event from "../../types/event";

interface CalendarGridCellProperties {
  datetime: Date;
  event?: Event;
  onSave: (event: Partial<Event> & { startDate: string }) => void;
}

const CalendarGridCell = ({
  datetime,
  event,
  onSave
}: CalendarGridCellProperties) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(event?.name || "");

  const handleOpen = () => {
    setOpen(true);
    setName(event?.name || "");
  };

  const handleSave = () => {
    onSave({
      ...event,
      name,
      startDate: datetime.toISOString(),
      endDate: new Date(datetime.getTime() + 60 * 60 * 1000).toISOString()
    });
    setOpen(false);
  };

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          borderBottom: "1px solid #eee",
          padding: "6px",
          minHeight: 32,
          position: "relative",
          cursor: "pointer",
          bgcolor: event ? "#2196f3" : "transparent",
          color: event ? "#fff" : "inherit",
          fontSize: "0.75rem",
          "&:hover": {
            backgroundColor: event ? "#1976d2" : "#f5f5f5"
          }
        }}
      >
        <Typography variant="caption">
          {datetime.getHours().toString().padStart(2, "0")}:
          {datetime.getMinutes().toString().padStart(2, "0")}
        </Typography>

        {event && (
          <Box mt={0.5} fontWeight={500}>
            {event.name}
          </Box>
        )}
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{event ? "Edit event" : "Add event"}</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <Typography variant="body2">
            Time:{" "}
            <strong>
              {datetime.getHours().toString().padStart(2, "0")}:
              {datetime.getMinutes().toString().padStart(2, "0")}
            </strong>
          </Typography>
          <TextField
            label="Event name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            {event ? "Save" : "Add"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarGridCell;
