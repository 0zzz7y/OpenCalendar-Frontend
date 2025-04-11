export type UUID = string;

export type RecurringPattern = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Calendar {
  id: UUID;
  name: string;
}

export interface Category {
  id: UUID;
  name: string;
  color: string;
}

export interface Event {
  id: UUID;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  recurringPattern: RecurringPattern;
  calendarId: UUID;
  categoryId?: UUID;
}

export interface Task {
  id: UUID;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  recurringPattern: RecurringPattern;
  status: TaskStatus;
  calendarId?: UUID;
  categoryId?: UUID;
}

export interface Note {
  id: UUID;
  name?: string;
  description: string;
  categoryId?: UUID;
}
