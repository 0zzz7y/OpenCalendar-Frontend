import THEME from "@/constant/theme"
import { useThemeMode } from "@/provider/ThemeProvider"

import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import IconButton from "@mui/material/IconButton"

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
