/**
 * Copyright (c) Tomasz Wnuk
 */

import { createTheme } from "@mui/material/styles"

const lightTheme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#1976d2"
    },

    background: {
      default: "#f3f3f3",
      paper: "#ffffff"
    },

    divider: "#ddd",

    text: {
      primary: "#222",
      secondary: "#555"
    }
  }
})

export default lightTheme
