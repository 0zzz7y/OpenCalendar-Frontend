import { useState } from "react"

import CalendarSelector, { CalendarOption } from "../calendar/CalendarSelector"
import CategorySelector, { Option } from "../category/CategorySelector"
import MonthlyCalendar from "../calendar/MonthlyCalendar"

export default function LeftPanel() {
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null)
  const [calendarData, setCalendarData] = useState<CalendarOption[]>([
    { label: "Osobisty", value: "personal", emoji: "🏠" },
    { label: "Praca", value: "work", emoji: "💼" },
  ])

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categoryData, setCategoryData] = useState<Option[]>([
    { label: "Siłownia", value: "gym", color: "#f59f00" },
    { label: "Ogród", value: "garden", color: "#40c057" },
  ])

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "12px",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          {<CalendarSelector
            data={calendarData}
            value={selectedCalendar}
            onChange={setSelectedCalendar}
            setData={setCalendarData}
          />}

          <CategorySelector
            data={categoryData}
            value={selectedCategory}
            onChange={setSelectedCategory}
            setData={setCategoryData}
          />
        </div>

        <div style={{ flexGrow: 1 }}>
          <MonthlyCalendar />
        </div>
      </div>
    </>
  )
}
