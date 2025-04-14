import { useState } from "react";
import { IconButton, Box } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsDialog from "./SettingsDialog";

export default function SettingsButton() {
  const [open, setOpen] = useState(false);

  return (
    <Box position="absolute" bottom={8} left={8}>
      <IconButton onClick={() => setOpen(true)} color="primary">
        <SettingsIcon />
      </IconButton>
      <SettingsDialog open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
