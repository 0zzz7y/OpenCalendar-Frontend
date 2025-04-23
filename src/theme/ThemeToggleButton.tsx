import { useThemeMode } from "./ThemeProvider"

import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import IconButton from "@mui/material/IconButton"

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
