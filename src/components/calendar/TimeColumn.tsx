import { Box, Typography, useTheme } from "@mui/material";

interface TimeColumnProperties {
  startHour?: number;
  endHour?: number;
  interval?: number;
}

const TimeColumn = ({
  startHour = 0,
  endHour = 23.5,
  interval = 30
}: TimeColumnProperties) => {
  const theme = useTheme();
  const times: string[] = [];

  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += interval) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        pr: 1,
        pt: 6,
        borderRight: `1px solid ${theme.palette.divider}`
      }}
    >
      {times.map((time, i) => (
        <Typography
          key={i}
          variant="caption"
          sx={{
            height: 32,
            lineHeight: "32px",
            pr: 1,
            fontSize: 12
          }}
        >
          {time}
        </Typography>
      ))}
    </Box>
  );
};

export default TimeColumn;
