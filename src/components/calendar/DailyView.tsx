import { useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button
} from "@mui/material";

import DayGrid from "./DayGrid";

const DailyView = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
  const [eventTitle, setEventTitle] = useState("");

  const handleSlotClick = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setOpenModal(true);
  };

  const handleAddEvent = () => {
    console.log("Dodano wydarzenie:", {
      hour: selectedHour,
      minute: selectedMinute,
      title: eventTitle
    });
    setOpenModal(false);
    setEventTitle("");
  };

  return (
    <>
      <DayGrid onSlotClick={handleSlotClick} />

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Dodaj wydarzenie</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <Typography variant="body2">
            Godzina:{" "}
            <strong>
              {selectedHour?.toString().padStart(2, "0")}:
              {selectedMinute?.toString().padStart(2, "0")}
            </strong>
          </Typography>
          <TextField
            label="Nazwa wydarzenia"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleAddEvent}
            disabled={!eventTitle.trim()}
          >
            Dodaj
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DailyView;
