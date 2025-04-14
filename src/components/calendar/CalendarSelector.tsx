import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Popover,
  Select,
  Stack,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import { AddCircle, Delete,  } from "@mui/icons-material";

const initialCalendars = [
  { id: "all", name: "Wszystkie" },
  { id: "university", name: "Rok akademicki", color: "#ffeb3b" },
  { id: "vacation", name: "Wakacje" },
  { id: "other", name: "Inne", },
];

export default function CalendarSelector() {
  const [categories, setCalendars] = useState(initialCalendars);
  const [selectedId, setSelectedId] = useState("all");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#1e3a8a");

  const open = Boolean(anchorEl);

  const handleAddCalendar = () => {
    if (newName.trim() === "") return;
    const newCalendar = {
      id: Date.now().toString(),
      name: newName,
      color: newColor,
    };
    setCalendars((prev) => [...prev, newCalendar]);
    setNewName("");
    setNewColor("#1e3a8a");
    setAnchorEl(null);
  };

  const handleRemoveCalendar = (id: string) => {
    if (id === "all") return;
    setCalendars((prev) => prev.filter((calendar) => calendar.id !== id));
    if (selectedId === id) {
      setSelectedId("all");
    }
  };

  return (
    <Box maxWidth={220} width="100%">
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <FormControl fullWidth size="small">
          <InputLabel id="calendar-label">Kalendarz</InputLabel>
          <Select
            labelId="calendar-label"
            value={selectedId}
            label="Kalendarz"
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {categories.map((calendar) => (
              <MenuItem key={calendar.id} value={calendar.id}>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  {calendar.name}
                  {calendar.id !== "all" && selectedId !== calendar.id && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCalendar(calendar.id);
                      }}
                      color="error"
                      size="small"
                      sx={{ ml: 1 }}
                    >
                      <Delete sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          color="primary"
          sx={{
            width: 42,
            height: 42,
            ml: 1,
            alignSelf: "center",
          }}
        >
          <AddCircle sx={{ fontSize: 30 }} />
        </IconButton>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "bottom", horizontal: "left" }}
          slotProps={{ paper: { sx: { p: 2, borderRadius: 2, width: 240 } } }}
        >
          <Stack spacing={1}>
            <TextField
              fullWidth
              size="small"
              label="Nowy kalendarz"
              variant="outlined"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddCalendar} fullWidth>
              DODAJ
            </Button>
          </Stack>
        </Popover>
      </Stack>
    </Box>
  );
}
