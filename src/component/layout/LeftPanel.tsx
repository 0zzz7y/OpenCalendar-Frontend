import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

import ThemeToggleButton from "../theme/ThemeToggleButton"
import CategorySelector from "../category/CategorySelector"
import CalendarSelector from "../calendar/CalendarSelector"
import MonthlyCalendar from "../calendar/MonthlyCalendar"

import useFilters from "../../hook/api/useFilter"
import CalendarEditor from "../calendar/CalendarEditor"
import CategoryEditor from "../category/CategoryEditor"

const LeftPanel = () => {
  return (
    <>
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
    </>
  )
}

export default LeftPanel
