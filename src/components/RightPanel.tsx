import { Box } from "@mui/material";
import NotesPanel from "./note/NotesPanel";
import TasksPanel from "./task/TasksPanel";

export default function RightPanel() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
      <Box sx={{ flexGrow: 1, position: "relative", border: "1px solid #ccc", borderRadius: 2, p: 1 }}>
        <NotesPanel />
      </Box>

      <Box sx={{ height: 250, border: "1px solid #ccc", borderRadius: 2, p: 1, overflowY: "auto" }}>
        <TasksPanel />
      </Box>
    </Box>
  );
}
