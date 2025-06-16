import type React from "react"
import { useMemo, useState, createContext, useContext } from "react"

import { ThemeProvider as MaterialThemeProvider } from "@mui/material"
import type { Theme as MaterialTheme } from "@mui/material/styles"

import { darkTheme } from "@/themes/dark.theme"
import { lightTheme } from "@/themes/light.theme"

import { Theme } from "@/themes/theme.type"

const ThemeModeContext = createContext({
  mode: Theme.LIGHT,
  toggle: () => {}
})

export const useThemeMode = () => useContext(ThemeModeContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<Theme.LIGHT | Theme.DARK>(Theme.LIGHT)

  const currentTheme: MaterialTheme = useMemo(() => (mode === Theme.LIGHT ? lightTheme : darkTheme), [mode])

  const toggle = () => {
    setMode((previous) => (previous === Theme.LIGHT ? Theme.DARK : Theme.LIGHT))
  }

  return (
    <>
      <ThemeModeContext.Provider value={{ mode, toggle }}>
        <MaterialThemeProvider theme={currentTheme}>{children}</MaterialThemeProvider>
      </ThemeModeContext.Provider>
    </>
  )
}
