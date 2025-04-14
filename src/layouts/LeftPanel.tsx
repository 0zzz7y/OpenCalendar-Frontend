import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CalendarSelector from "../components/calendar/CalendarSelector";
import CategorySelector from "../components/category/CategorySelector";
import MonthlyCalendar from "../components/calendar/MonthlyCalendar";

interface LeftPanelProperties {
  onHide: () => void;
  onShow: () => void;
  isOpen: boolean;
}

export default function LeftPanel({ onHide, onShow, isOpen }: LeftPanelProperties) {
  return (
    <Box
      bgcolor="#f5f5f5"
      p={2}
      display="flex"
      flexDirection="column"
      gap={2}
      height="100%"
    >
      <Box display="flex" justifyContent="flex-end">
        <IconButton
          onClick={isOpen ? onHide : onShow}
          size="small"
        >
          <MenuIcon />
        </IconButton>
      </Box>

      <CalendarSelector />
      <CategorySelector />
      <MonthlyCalendar />
    </Box>
  );
}
