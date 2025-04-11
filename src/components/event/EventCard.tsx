// src/components/EventCard.tsx
import { Paper, Typography } from "@mui/material";

interface EventCardProps {
  name: string;
  start: string;
  end: string;
  color?: string;
}

export default function EventCard({ name, start, end, color = "#42a5f5" }: EventCardProps) {
  return (
    <Paper
      sx={{
        p: 1,
        backgroundColor: color,
        color: "#fff",
        borderRadius: 1,
        fontSize: "0.75rem",
        overflow: "hidden"
      }}
      elevation={3}
    >
      <Typography fontWeight="bold">{name}</Typography>
      <Typography variant="caption">
        {start} – {end}
      </Typography>
    </Paper>
  );
}
