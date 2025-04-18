import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2"
    },
    background: {
      default: "#f5f5f5"
    }
  }
});

export default lightTheme;
