import React, { useMemo, useState, createContext, useContext } from "react"

import { Theme } from "@mui/material/styles"

import { ThemeProvider as MuiThemeProvider } from "@mui/material"

import lightTheme from "../component/theme/lightTheme"
import darkTheme from "../component/theme/darkTheme"

import THEME from "@/constant/theme"

const ThemeModeContext = createContext({
  mode: THEME.LIGHT,
  toggle: () => {}
})

export const useThemeMode = () => useContext(ThemeModeContext)

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<THEME.LIGHT | THEME.DARK>(THEME.LIGHT)

  const toggle = () => {
    setMode((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT))
  }

  const theme: Theme = useMemo(
    () => (mode === THEME.LIGHT ? lightTheme : darkTheme),
    [mode]
  )

  return (
    <>
      <ThemeModeContext.Provider value={{ mode, toggle }}>
        <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
      </ThemeModeContext.Provider>
    </>
  )
}

export default ThemeProvider
