import React, { useMemo, useState, createContext, useContext } from "react"
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material"
import { Theme } from "@mui/material/styles"

import lightTheme from "./lightTheme"
import darkTheme from "./darkTheme"

const ThemeModeContext = createContext({
  mode: "light",
  toggle: () => {}
})

export const useThemeMode = () => useContext(ThemeModeContext)

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">("light")

  const toggle = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"))
  }

  const theme: Theme = useMemo(() => (mode === "light" ? lightTheme : darkTheme), [mode])

  return (
    <>
      <ThemeModeContext.Provider value={{ mode, toggle }}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </ThemeModeContext.Provider>
    </>
  )
}

export default ThemeProvider
