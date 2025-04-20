import { Box } from "@mui/material"
import NotesPanel from "@/component/note/NotesPanel"
import TasksPanel from "@/component/task/TasksPanel"

const RightPanel = () => {
  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Box height="0%">
        <NotesPanel />
      </Box>

      <Box flexGrow={1} overflow="auto">
        <TasksPanel />
      </Box>
    </Box>
  )
}

export default RightPanel
