import RecurringPattern from "./recurringPattern";

export default interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  recurringPattern?: RecurringPattern;
  calendarId: string;
  categoryId?: string;
  color?: string;
}
