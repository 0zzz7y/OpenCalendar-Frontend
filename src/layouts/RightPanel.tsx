import TaskBoard from "../components/task/TaskBoard";
import NotesPanel from "../components/note/NotesPanel";
import { Box, Typography } from "@mui/material";

export default function RightPanel() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
      bgcolor="#fafafa"
      p={2}
      gap={2}
    >
      <NotesPanel />

      <Box flex="1" overflow="auto" bgcolor="#fff" borderRadius={2} p={1}>
        <TaskBoard />
      </Box>
    </Box>
  );
}
