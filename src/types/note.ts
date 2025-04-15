import { UUID } from "./shared";

export interface Note {
  id: UUID;
  name?: string;
  description: string;
  calendarId: UUID;
  categoryId?: UUID;
}
