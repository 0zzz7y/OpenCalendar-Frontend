import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

import ThemeToggleButton from "../theme/ThemeToggleButton"
import CategorySelector from "../category/CategorySelector"
import CalendarSelector from "../calendar/CalendarSelector"
import MonthlyCalendar from "../calendar/MonthlyCalendar"

import useFilters from "../../hook/api/useFilter"

const LeftPanel = () => {
  const {
    selectedCalendar,
    setSelectedCalendar,
    selectedCategory,
    setSelectedCategory
  } = useFilters()

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
      >
        <Stack spacing={2}>
          <CalendarSelector
            value={selectedCalendar}
            onChange={setSelectedCalendar}
          />

          <CategorySelector
            value={selectedCategory}
            onChange={setSelectedCategory}
          />

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
