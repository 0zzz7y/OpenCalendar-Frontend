import IconButton from "@mui/material/IconButton"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"

import { useThemeMode } from "./ThemeProvider"

import THEME from "@/constant/theme"

const ThemeToggleButton = () => {
  const { mode, toggle } = useThemeMode()

  return (
    <>
      <IconButton onClick={toggle} color="inherit">
        {mode === THEME.DARK ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </>
  )
}

export default ThemeToggleButton
