import { ReactNode } from "react"
import { Paper, Typography, Box } from "@mui/material"

interface Properties {
  title: string
  icon: ReactNode
  children: ReactNode
}

const TaskColumn = ({ title, icon, children }: Properties) => {
  return (
<Paper
  sx={{
    minHeight: 500,
    width: "100%", // This will allow TaskColumn to expand and take full available width
    backgroundColor: "#fefefe",
    borderRadius: 2,
    p: 2,
    boxShadow: 3,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  }}
>
  <Box display="flex" alignItems="center" justifyContent="center" gap={1.5}>
    <Box display="flex" alignItems="center" sx={{ mt: "-8px", color: "#000" }}>
      {icon}
    </Box>
    <Typography variant="h6" fontWeight="bold" sx={{ color: "#000" }}>
      {title}
    </Typography>
  </Box>

  {children}
</Paper>

  )
}

export default TaskColumn
