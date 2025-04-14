import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CalendarSelector from "../components/calendar/CalendarSelector";
import CategorySelector from "../components/category/CategorySelector";
import MonthlyCalendar from "../components/calendar/MonthlyCalendar";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ThemeToggle from "../components/theme/ThemeToggle";
import SettingsButton from "../components/settings/SettingsButton";
import SettingsDialog from "../components/settings/SettingsDialog";
import { useState } from "react";
import LogoHeader from "../components/common/LogoHeader";

interface LeftPanelProperties {
  onHide: () => void;
  onShow: () => void;
  isOpen: boolean;
  toggleTheme: () => void;
}

export default function LeftPanel({ onHide, onShow, isOpen, toggleTheme }: LeftPanelProperties) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <Box bgcolor="#f5f5f5" p={2} display="flex" flexDirection="column" gap={2} height="100%">
      <Box display="flex" justifyContent="flex-start">
        <LogoHeader />
      </Box>

      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={isOpen ? onHide : onShow} size="small">
          <MenuIcon />
        </IconButton>
      </Box>

      <CalendarSelector />

      <CategorySelector />

      <MonthlyCalendar />

      <Box display="flex" flexDirection="column" gap={2}>
        <ThemeToggle onToggle={toggleTheme} />
        <IconButton onClick={() => setSettingsOpen(true)} size="small">
          <SettingsButton />
        </IconButton>
      </Box>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Box>
  );
}
