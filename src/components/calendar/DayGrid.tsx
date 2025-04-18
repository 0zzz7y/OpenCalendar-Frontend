import { Box, Typography } from "@mui/material";

interface DayGridProperties {
  onSlotClick: (hour: number, minute: number, element: HTMLElement) => void;
}

const DayGrid = ({ onSlotClick }: DayGridProperties) => {
  const slots = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? 0 : 30;
    return { hour, minute };
  });

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        border="1px solid #ddd"
      >
        {slots.map(({ hour, minute }, i) => (
          <Box
            key={i}
            onClick={(e) => onSlotClick(hour, minute, e.currentTarget)}
            sx={{
              borderBottom: "1px solid #eee",
              padding: "6px 12px",
              minHeight: 32,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f5f5f5"
              }
            }}
          >
            <Typography variant="caption">
              {`${hour.toString().padStart(2, "0")}:${minute === 0 ? "00" : "30"}`}
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default DayGrid;
