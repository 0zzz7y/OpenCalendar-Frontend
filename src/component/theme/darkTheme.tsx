import { createTheme } from "@mui/material/styles"

const darkTheme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#90caf9"
    },

    background: {
      default: "#2a2a2a",
      paper: "#3a3a3a"
    },

    divider: "#555",

    text: {
      primary: "#e0e0e0",
      secondary: "#bbb"
    }
  }
})

export default darkTheme
