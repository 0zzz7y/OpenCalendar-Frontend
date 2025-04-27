import { useEffect, useRef } from "react"
import dayjs from "dayjs"
import useApplicationStorage from "@/storage/useApplicationStorage"

export default function useNotificationScheduler() {
  const { events } = useApplicationStorage()
  const notifiedEventIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs()

      events.forEach((event) => {
        const eventTime = dayjs(event.startDate)

        if (
          eventTime.isBefore(now.add(1, "minute")) &&
          eventTime.isAfter(now.subtract(1, "minute")) &&
          !notifiedEventIds.current.has(event.id)
        ) {
          if (Notification.permission === "granted") {
            new Notification(event.name, {
              body: `Event "${event.name}" is starting now!`
            })
          }

          notifiedEventIds.current.add(event.id)
        }
      })
    }, 60000)

    return () => clearInterval(interval)
  }, [events])
}
