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
import { AddCircle, Delete } from "@mui/icons-material";

const initialCategories = [
  { id: "all", name: "Wszystkie", color: "gray" },
  { id: "personal", name: "Osobisty", color: "#ffeb3b" },
  { id: "work", name: "Praca", color: "#4caf50" },
  { id: "school", name: "Studia", color: "#f44336" },
];

export default function CategorySelector() {
  const [categories, setCategories] = useState(initialCategories);
  const [selectedId, setSelectedId] = useState("all");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#1e3a8a");

  const open = Boolean(anchorEl);

  const handleAddCategory = () => {
    if (newName.trim() === "") return;
    const newCategory = {
      id: Date.now().toString(),
      name: newName,
      color: newColor,
    };
    setCategories((prev) => [...prev, newCategory]);
    setNewName("");
    setNewColor("#1e3a8a");
    setAnchorEl(null);
  };

  const handleRemoveCategory = (id: string) => {
    if (id === "all") return;
    setCategories((prev) => prev.filter((category) => category.id !== id));
    if (selectedId === id) {
      setSelectedId("all");
    }
  };

  return (
    <Box maxWidth={220} width="100%">
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <FormControl fullWidth size="small">
          <InputLabel id="category-label">Kategorie</InputLabel>
          <Select
            labelId="category-label"
            value={selectedId}
            label="Kategorie"
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                {category.name}
                {category.id !== "all" && selectedId !== category.id && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCategory(category.id);
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
              label="Nowa kategoria"
              variant="outlined"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                style={{
                  width: 40,
                  height: 40,
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              />
              <Button variant="contained" onClick={handleAddCategory} fullWidth>
                DODAJ
              </Button>
            </Stack>
          </Stack>
        </Popover>
      </Stack>
    </Box>
  );
}
