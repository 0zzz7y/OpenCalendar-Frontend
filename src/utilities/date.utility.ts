import dayjs from "dayjs"

export function formatFullDate(date: Date): string {
  return dayjs(date).format("D MMMM YYYY")
}

export function formatDayName(date: Date): string {
  return dayjs(date).format("dddd")
}

export function formatTime(date: string | Date): string {
  return dayjs(date).format("H:mm")
}
