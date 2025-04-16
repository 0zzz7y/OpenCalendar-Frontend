import { Box, Typography, Divider } from "@mui/material"

import NotesPanel from "../note/NotesPanel"
import TasksPanel from "../task/TasksPanel"

const RightPanel = () => {
  return (
    <>
      <Box display="flex" flexDirection="column" gap={2} height="100%">
        <Box>
          <Typography variant="h6">Sticky Notes</Typography>
          <NotesPanel />
        </Box>

        <Divider />

        <Box flexGrow={1} overflow="hidden">
          <Typography variant="h6" mb={1}>Tasks</Typography>
          <TasksPanel />
        </Box>
      </Box>
    </>
  )
}

export default RightPanel
