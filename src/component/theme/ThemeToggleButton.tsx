import IconButton from "@mui/material/IconButton"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"

import { useThemeMode } from "./ThemeProvider"

const ThemeToggleButton = () => {
  const { mode, toggle } = useThemeMode()

  return (
    <>
      <IconButton onClick={toggle} color="inherit">
        {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </>
  )
}

export default ThemeToggleButton
