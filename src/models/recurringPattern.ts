export interface RecurringPattern {
  frequency: "DAILY" | "WEEKLY" | "MONTHLY"
  interval: number
  endDate?: string
}
