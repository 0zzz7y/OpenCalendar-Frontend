import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

import ThemeToggleButton from "@/component/theme/ThemeToggleButton"
import CategorySelector from "@/component/category/CategorySelector"
import CalendarSelector from "@/component/calendar/CalendarSelector"
import MonthlyCalendar from "@/component/calendar/MonthlyCalendar"

import CalendarEditor from "@/component/calendar/CalendarEditor"
import CategoryEditor from "@/component/category/CategoryEditor"

const LeftPanel = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100%"
    >
      <Stack spacing={2}>
        <CalendarSelector />
        <CalendarEditor />
        <CategorySelector />
        <CategoryEditor />
        <Box sx={{ alignSelf: "flex-start", mt: "-16px", ml: "-24px" }}>
          <MonthlyCalendar />
        </Box>
      </Stack>
      <Box>
        <ThemeToggleButton />
      </Box>
    </Box>
  )
}

export default LeftPanel
