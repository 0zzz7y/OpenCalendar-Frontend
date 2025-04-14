import { IconButton, Tooltip, useTheme } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

interface ThemeToggleProperties {
  onToggle: () => void;
}

export default function ThemeToggle({ onToggle }: ThemeToggleProperties) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <IconButton onClick={onToggle} color="inherit" size="small">
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
