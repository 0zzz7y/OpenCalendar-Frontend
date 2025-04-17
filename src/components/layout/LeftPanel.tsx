import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import { useState } from "react"

import ThemeToggleButton from "../theme/ThemeToggleButton"
import CategorySelector, { CategoryOption } from "../category/CategorySelector"
import CalendarSelector, { CalendarOption } from "../calendar/CalendarSelector"
import MonthlyCalendar from "../calendar/MonthlyCalendar"

const LeftPanel = () => {
  const [calendarOptions, setCalendarOptions] = useState<CalendarOption[]>([
    { label: "Osobisty", value: "personal" },
    { label: "Praca", value: "work" }
  ])

  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([
    { label: "Osobisty", value: "personal", color: "#3b5bdb" },
    { label: "Praca", value: "work", color: "#fa5252" }
  ])

  const [selectedCalendar, setSelectedCalendar] = useState<string | null>("personal")
  const [selectedCategory, setSelectedCategory] = useState<string | null>("personal")

  return (
    <>
      <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
        <Stack spacing={2}>
          <CalendarSelector
            data={calendarOptions}
            value={selectedCalendar}
            onChange={(val) => setSelectedCalendar(val)}
            setData={setCalendarOptions}
          />

          <CategorySelector
            data={categoryOptions}
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
            setData={setCategoryOptions}
          />

          <Box
            sx={{
              alignSelf: "flex-start",
              mt: "-16px",
              ml: "-24px",
            }}
          >
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