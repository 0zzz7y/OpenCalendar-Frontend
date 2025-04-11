import { RecurringPattern, UUID } from '../../features/shared/types';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface Task {
  id: UUID;
  name: string;
  description?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  recurringPattern: RecurringPattern;
  status: TaskStatus;
  calendarId?: UUID | null;
  categoryId?: UUID;
}
