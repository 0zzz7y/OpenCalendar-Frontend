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
        width: "100%",
        maxHeight: "80vh",
        backgroundColor: "#fefefe",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        boxShadow: 3,
        overflow: "hidden"
      }}
    >
      <Box
        sx={{
          height: 64,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#f5f5f5"
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
            boxShadow: 1
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
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}
      >
        {children}
      </Box>
    </Paper>
  )
}

export default TaskColumn
