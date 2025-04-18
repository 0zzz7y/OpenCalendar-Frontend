import { SetStateAction, useState } from "react";

import WeeklyView from "../calendar/WeeklyView";
import EventPopover from "../event/EventPopover";

import { Button, Typography, Box } from "@mui/material";
import Event from "@/types/event";

const CenterPanel = () => {
  const [view, setView] = useState("week");
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSlotClick = (slot: SetStateAction<null>) => {
    setSelectedSlot(slot);
  };

  const handleClosePopover = () => {
    setSelectedSlot(null);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1}
      >
        <Typography variant="h5">Lipiec, 2025</Typography>

        <Box display="flex" gap={2}>
          <Button onClick={() => setView("day")}>Dzień</Button>
          <Button onClick={() => setView("week")} variant="outlined">
            Tydzień
          </Button>
          <Button onClick={() => setView("month")}>Miesiąc</Button>
        </Box>
      </Box>

      <WeeklyView />

      {selectedSlot && (
        <EventPopover
          anchorEl={null}
          onClose={function (): void {
            throw new Error("Function not implemented.");
          }}
          onSave={function (event: Partial<Event>): void {
            throw new Error("Function not implemented.");
          }}
          calendars={[]}
          categories={[]}
        />
      )}
    </>
  );
};

export default CenterPanel;
