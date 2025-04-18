import { Box, Typography, useTheme } from "@mui/material";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  format
} from "date-fns";
import { pl } from "date-fns/locale";
import { JSX } from "react";

import { Event } from "../../types/event";

interface MonthlyViewProperties {
  currentDate: Date;
  events: Event[];
  onDayClick: (date: Date) => void;
}

const DAYS_IN_WEEK = 7;

const MonthlyView = ({
  currentDate,
  events,
  onDayClick
}: MonthlyViewProperties) => {
  const theme = useTheme();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(new Date(day));
    day = addDays(day, 1);
  }

  const weekdayLabels = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i);
    return format(date, "EEEEEE", { locale: pl }).toUpperCase();
  });

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={`repeat(${DAYS_IN_WEEK}, 1fr)`}
        textAlign="center"
        fontWeight={600}
      >
        {weekdayLabels.map((label, index) => (
          <Box key={index} py={1}>
            {label}
          </Box>
        ))}
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={`repeat(${DAYS_IN_WEEK}, 1fr)`}
        gridAutoRows="120px"
        borderTop="1px solid #ccc"
        borderLeft="1px solid #ccc"
      >
        {days.map((day, index) => {
          const dayEvents = events.filter((e) =>
            isSameDay(new Date(e.start), day)
          );

          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <Box
              key={index}
              sx={{
                borderRight: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
                backgroundColor: isToday
                  ? theme.palette.action.hover
                  : "inherit",
                color: isCurrentMonth ? "inherit" : theme.palette.text.disabled,
                padding: "4px",
                cursor: "pointer",
                overflow: "hidden"
              }}
              onClick={() => onDayClick(new Date(day))}
            >
              <Typography variant="caption" fontWeight={isToday ? 700 : 400}>
                {day.getDate()}
              </Typography>

              {dayEvents.slice(0, 2).map((event, i) => (
                <Box
                  key={i}
                  sx={{
                    mt: 0.5,
                    fontSize: "0.75rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    borderRadius: 1,
                    padding: "1px 4px",
                    backgroundColor: event.color || "#1976d2",
                    color: "#fff"
                  }}
                >
                  {event.title}
                </Box>
              ))}

              {dayEvents.length > 2 && (
                <Typography variant="caption" color="primary">
                  +{dayEvents.length - 2} więcej
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default MonthlyView;
