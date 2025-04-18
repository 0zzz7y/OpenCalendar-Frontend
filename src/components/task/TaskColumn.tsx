import { ReactNode } from "react";

import { Paper, Typography, Box } from "@mui/material";

interface Properties {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

const TaskColumn = ({ title, icon, children }: Properties) => {
  return (
    <>
      <Paper
        sx={{
          width: 200,
          minHeight: 400,
          p: 2,
          mx: 1,
          border: "2px dashed #2196f3",
          backgroundColor: "#f9f9f9",
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {icon}
          <Typography variant="subtitle1" fontWeight="bold">
            {title}
          </Typography>
        </Box>

        {children}
      </Paper>
    </>
  );
};

export default TaskColumn;
