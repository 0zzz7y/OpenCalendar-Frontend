// src/components/TaskCard.tsx
import { Paper, Typography } from "@mui/material";

interface TaskCardProps {
  title: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
}

export default function TaskCard({ title, status = "TODO" }: TaskCardProps) {
  return (
    <Paper
      sx={{
        p: 1,
        backgroundColor: "#fff",
        borderLeft: `5px solid ${status === "DONE" ? "#66bb6a" : "#ffa726"}`,
        borderRadius: 1,
        mb: 1
      }}
    >
      <Typography>{title}</Typography>
    </Paper>
  );
}
