import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useState } from "react";

interface Calendar {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

export default function CalendarCategorySelector() {
  const [calendar, setCalendar] = useState("personal");
  const [category, setCategory] = useState("gym");

  const [calendarList, setCalendarList] = useState<Calendar[]>([
    { id: "personal", name: "Osobisty" },
    { id: "work", name: "Praca" },
    { id: "studies", name: "Studia" },
  ]);

  const [categoryList, setCategoryList] = useState<Category[]>([
    { id: "gym", name: "Siłownia", color: "#f44336" },
    { id: "garden", name: "Ogród", color: "#4caf50" },
    { id: "shopping", name: "Zakupy", color: "#2196f3" },
  ]);

  const [newCalendar, setNewCalendar] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#ffeb3b");

  const handleCalendarChange = (event: SelectChangeEvent) => setCalendar(event.target.value);
  const handleCategoryChange = (event: SelectChangeEvent) => setCategory(event.target.value);

  const handleAddCalendar = () => {
    const trimmed = newCalendar.trim();
    if (trimmed && !calendarList.find((c) => c.name === trimmed)) {
      const id = trimmed.toLowerCase().replace(/\s+/g, "-");
      setCalendarList([...calendarList, { id, name: trimmed }]);
      setCalendar(id);
      setNewCalendar("");
    }
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categoryList.find((c) => c.name === trimmed)) {
      const id = trimmed.toLowerCase().replace(/\s+/g, "-");
      setCategoryList([...categoryList, { id, name: trimmed, color: newCategoryColor }]);
      setCategory(id);
      setNewCategory("");
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" mb={1}>
        Wybór
      </Typography>

      {/* Kalendarze */}
      <FormControl fullWidth sx={{ mb: 1 }}>
        <InputLabel id="calendar-select-label">Kalendarz</InputLabel>
        <Select
          labelId="calendar-select-label"
          value={calendar}
          label="Kalendarz"
          onChange={handleCalendarChange}
        >
          {calendarList.map((c) => (
            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="Nowy kalendarz"
          value={newCalendar}
          onChange={(e) => setNewCalendar(e.target.value)}
          fullWidth
        />
        <Button onClick={handleAddCalendar} variant="contained" size="small">
          Dodaj
        </Button>
      </Stack>

      {/* Kategorie */}
      <FormControl fullWidth sx={{ mb: 1 }}>
        <InputLabel id="category-select-label">Kategoria</InputLabel>
        <Select
          labelId="category-select-label"
          value={category}
          label="Kategoria"
          onChange={handleCategoryChange}
        >
          {categoryList.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: c.color,
                  mr: 1,
                }}
              />
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          size="small"
          label="Nowa kategoria"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          fullWidth
        />
        <input
          type="color"
          value={newCategoryColor}
          onChange={(e) => setNewCategoryColor(e.target.value)}
          style={{
            width: 32,
            height: 32,
            padding: 0,
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        />
        <Button onClick={handleAddCategory} variant="contained" size="small">
          Dodaj
        </Button>
      </Stack>
    </Box>
  );
}
