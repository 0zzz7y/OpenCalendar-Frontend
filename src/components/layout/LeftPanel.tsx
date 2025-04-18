import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import ThemeToggleButton from "../theme/ThemeToggleButton";
import CategorySelector, { CategoryOption } from "../category/CategorySelector";
import CalendarSelector, { CalendarOption } from "../calendar/CalendarSelector";
import MonthlyCalendar from "../calendar/MonthlyCalendar";

import useDashboard from "../../hooks/useDashboard";
import useFilters from "../../hooks/useFilters";

const LeftPanel = () => {
  const { calendars, categories } = useDashboard();
  const {
    selectedCalendar,
    setSelectedCalendar,
    selectedCategory,
    setSelectedCategory
  } = useFilters();

  const [calendarOptions, setCalendarOptions] = useState<CalendarOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);

  useEffect(() => {
    setCalendarOptions(
      calendars.map((cal) => ({
        label: cal.name,
        value: cal.id,
        emoji: cal.emoji
      }))
    );
  }, [calendars]);

  useEffect(() => {
    setCategoryOptions(
      categories.map((cat) => ({
        label: cat.name,
        value: cat.id,
        color: cat.color
      }))
    );
  }, [categories]);

  return (
    <>
      <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
        <Stack spacing={2}>
          <CalendarSelector
            data={calendarOptions}
            value={selectedCalendar}
            onChange={setSelectedCalendar}
            setData={setCalendarOptions}
          />

          <CategorySelector
            data={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            setData={setCategoryOptions}
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
  );
};

export default LeftPanel;
