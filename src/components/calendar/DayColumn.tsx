import { Box } from "@mui/material"
import CalendarGridCell from "./CalendarGridCell"
import { Event } from "../../types/event"

interface DayColumnProperties {
  date: Date
  events: Event[]
  onSave: (event: Partial<Event> & { start: string }) => void
}

const DayColumn = ({ date, events, onSave }: DayColumnProperties) => {
  const slots = Array.from({ length: 24 * 2 }, (_, i) => {
    const d = new Date(date)
    d.setHours(Math.floor(i / 2), i % 2 === 0 ? 0 : 30, 0, 0)
    return d
  })

  return (
    <Box flex={1} borderLeft="1px solid #ddd">
      {slots.map((slot, i) => {
        const matchingEvent = events.find(
          (ev) => new Date(ev.start).getHours() === slot.getHours() &&
                  new Date(ev.start).getMinutes() === slot.getMinutes()
        )

        return (
          <CalendarGridCell
            key={i}
            datetime={slot}
            event={matchingEvent}
            onSave={onSave}
          />
        )
      })}
    </Box>
  )
}

export default DayColumn
