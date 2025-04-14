import { ReactComponent as Logo } from "../../assets/logo.svg";
import { Box } from "@mui/material";

export default function LogoHeader() {
  return (
    <Box
      width={42}
      height={42}
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="50%"
      bgcolor="#1976d2"
      sx={{
        transition: "background-color 0.3s ease, transform 0.3s ease",
        "&:hover": {
          bgcolor: "#333",
          transform: "scale(1.05)",
          cursor: "pointer",
        },
      }}
    >
      <Logo style={{ width: 24, height: 24 }} />
    </Box>
  );
}
