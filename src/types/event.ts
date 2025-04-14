import { UUID } from "./shared";
import { RecurringPattern } from "./shared";

export interface EventDto {
  id: UUID;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  recurringPattern: RecurringPattern;
  calendarId: UUID;
  categoryId?: UUID;
}
