import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import ThemeToggleButton from "../theme/ThemeToggleButton";
import CategorySelector, { CategoryOption } from "../category/CategorySelector";
import CalendarSelector from "../calendar/CalendarSelector";
import MonthlyCalendar from "../calendar/MonthlyCalendar";

import useDashboard from "../../hooks/useDashboard";
import useFilters from "../../hooks/useFilters";

const LeftPanel = () => {
  const { categories } = useDashboard();
  const {
    selectedCalendar,
    setSelectedCalendar,
    selectedCategory,
    setSelectedCategory
  } = useFilters();

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
  );
};

export default LeftPanel;
