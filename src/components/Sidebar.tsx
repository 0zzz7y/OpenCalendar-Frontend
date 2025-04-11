// src/components/Sidebar.tsx
import { Box, Typography, Paper, Stack } from "@mui/material";

export default function Sidebar() {
  return (
    <Box sx={{ p: 2 }}>
      {/* Nagłówek sekcji */}
      <Typography variant="h6" mb={1}>
        Szybki podgląd
      </Typography>

      {/* Notatki */}
      <Typography variant="subtitle2" mt={2}>
        Notatki
      </Typography>
      <Paper variant="outlined" sx={{ p: 1, my: 1 }}>
        • Przykładowa notatka
      </Paper>

      {/* Zadania */}
      <Typography variant="subtitle2" mt={2}>
        Zadania
      </Typography>
      <Stack spacing={1}>
        <Paper variant="outlined" sx={{ p: 1 }}>• Zadanie 1</Paper>
        <Paper variant="outlined" sx={{ p: 1 }}>• Zadanie 2</Paper>
      </Stack>
    </Box>
  );
}

// Dodaj pusty export na koniec, aby działało z --isolatedModules
export {};
