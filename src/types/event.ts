export default interface Event {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  calendarId: string
  categoryId?: string
  color?: string
}
