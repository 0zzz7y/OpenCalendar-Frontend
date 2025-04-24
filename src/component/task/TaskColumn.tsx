import type React from "react"
import type { ReactNode } from "react"
import { Paper, Typography, Box } from "@mui/material"

export interface TaskColumnProps {
  title: string
  icon: ReactNode
  children: ReactNode
}

/**
 * Column container for a specific task status, with header and list of tasks.
 */
const TaskColumn: React.FC<TaskColumnProps> = ({ title, icon, children }) => (
  <Paper
    sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: 500,
      maxHeight: "80vh",
      width: "100%",
      backgroundColor: "#fefefe",
      borderRadius: 2,
      boxShadow: 3,
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        /* Lock the header to exactly 64px tall */
        flex: "0 0 64px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: "#fff",
          boxShadow: 1,
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ color: "#000", textAlign: "center" }}
      >
        {title}
      </Typography>
    </Box>

    <Box
      sx={{
        /* Let the task list grow/shrink and scroll */
        flex: "1 1 auto",
        overflowY: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {children}
    </Box>
  </Paper>
)


export default TaskColumn
