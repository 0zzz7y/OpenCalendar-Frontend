import { Box, Typography } from "@mui/material";

export default function HourLabelsColumn() {
  // generate a Date for each hour of today
  const hours = Array.from({ length: 24 }, (_, i) => {
    const d = new Date();
    d.setHours(i, 0, 0, 0);
    // respect the user’s locale/time‑format preference
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(d);
  });

  return (
    <Box
      sx={{
        width: 60,
        flexShrink: 0,
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        pt: 0, // remove top padding
      }}
    >
      {hours.map((label, idx) => (
        <Box
          key={idx}
          sx={{
            height: 64, // match your slot height
            px: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end", // right‑align time labels
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 12 }}
          >
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
