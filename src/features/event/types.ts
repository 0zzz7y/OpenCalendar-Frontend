import { UUID, RecurringPattern } from '../../features/shared/types';

export interface Event {
  id: UUID;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  recurringPattern: RecurringPattern;
  calendarId: UUID;
  categoryId?: UUID;
  color?: string;
}
