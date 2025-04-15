import { UUID } from "./shared";
import { RecurringPattern } from "./shared";

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface Task {
  id: UUID;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  recurringPattern: RecurringPattern;
  status: TaskStatus;
  calendarId: UUID;
  categoryId?: UUID;
}

