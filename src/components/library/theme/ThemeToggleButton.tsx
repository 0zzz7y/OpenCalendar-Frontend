import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import IconButton from "@mui/material/IconButton"

import { useThemeMode } from "@/themes/ThemeProvider"
import { Theme } from "@/themes/theme.type"

export const ThemeToggleButton = () => {
  const { mode, toggle } = useThemeMode()

  return (
    <>
      <IconButton onClick={toggle} color="inherit">
        {mode === Theme.DARK ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </>
  )
}
