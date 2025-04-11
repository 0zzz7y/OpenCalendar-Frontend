import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import AddIcon from "@mui/icons-material/Add";

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
  IconButton,
  Popper,
  ClickAwayListener,
} from "@mui/material";
import { SetStateAction, useState } from "react";

interface Calendar {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  emoji?: string;
}

export default function CalendarCategorySelector() {
  const [calendar, setCalendar] = useState("all");
  const [category, setCategory] = useState("all");
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("🏷️");
  const [calendarPopperAnchor, setCalendarPopperAnchor] = useState<null | HTMLElement>(null);
  const [categoryPopperAnchor, setCategoryPopperAnchor] = useState<null | HTMLElement>(null);
  
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
const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

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
      setCategoryList([...categoryList, { id, name: trimmed, color: newCategoryColor, emoji: newCategoryEmoji || "🏷️" }]);
      setCategory(id);
      setNewCategory("");
      setNewCategoryEmoji("");
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" mb={1}>
        Wybór
      </Typography>



      {/* Kalendarze */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
  <FormControl fullWidth>
    <InputLabel id="calendar-select-label">Kalendarz</InputLabel>
    <Select
      labelId="calendar-select-label"
      value={calendar}
      label="Kalendarz"
      onChange={handleCalendarChange}
    >
      <MenuItem value="all"><Typography fontStyle="italic">Wszystkie</Typography></MenuItem>
      {calendarList.map((c) => (
        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
      ))}
    </Select>
  </FormControl>
  <IconButton
  size="small"
  onClick={(e) => setCalendarPopperAnchor(e.currentTarget)}
  sx={{ bgcolor: "#1976d2", color: "white", "&:hover": { bgcolor: "#1565c0" } }}
>
  <AddIcon fontSize="small" />
</IconButton>
</Box>
<Popper open={!!calendarPopperAnchor} anchorEl={calendarPopperAnchor} placement="bottom-start">
  <ClickAwayListener onClickAway={() => setCalendarPopperAnchor(null)}>
    <Box sx={{ p: 2, bgcolor: "white", boxShadow: 3, borderRadius: 1, width: 200 }}>
      <TextField
        size="small"
        label="Nowy kalendarz"
        value={newCalendar}
        onChange={(e) => setNewCalendar(e.target.value)}
        fullWidth
        sx={{ mb: 1 }}
      />
      <Button fullWidth size="small" variant="contained" onClick={() => {
        handleAddCalendar();
        setCalendarPopperAnchor(null);
      }}>
        Dodaj
      </Button>
    </Box>
  </ClickAwayListener>
</Popper>


      {/* Kategorie */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
  <FormControl fullWidth>
    <InputLabel id="category-select-label">Kategoria</InputLabel>
    <Select
      labelId="category-select-label"
      value={category}
      label="Kategoria"
      onChange={handleCategoryChange}
    >
      <MenuItem value="all"><Typography fontStyle="italic">Wszystkie</Typography></MenuItem>
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
  <Popper open={!!categoryPopperAnchor} anchorEl={categoryPopperAnchor} placement="bottom-start">
  <ClickAwayListener onClickAway={() => setCategoryPopperAnchor(null)}>
    <Box sx={{ p: 2, bgcolor: "white", boxShadow: 3, borderRadius: 1, width: 240 }}>
      <TextField
        size="small"
        label="Nowa kategoria"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        fullWidth
        sx={{ mb: 1 }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
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
<Button
  fullWidth
  size="small"
  variant="contained"
  color="primary"
  onClick={() => {
    handleAddCategory();
    setCategoryPopperAnchor(null);
  }}
>
  Dodaj
</Button>
      </Box>
    </Box>
  </ClickAwayListener>
</Popper>
<IconButton
  size="small"
  onClick={(e) => setCategoryPopperAnchor(e.currentTarget)}
  sx={{ bgcolor: "#1976d2", color: "white", "&:hover": { bgcolor: "#1565c0" } }}
>
  <AddIcon fontSize="small" />
</IconButton>
</Box>

    </Box>
  );
}
