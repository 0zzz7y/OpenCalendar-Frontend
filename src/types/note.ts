import { UUID } from "./shared";

export interface NoteDto {
  id: UUID;
  name?: string;
  description: string;
  calendarId: UUID;
  categoryId?: UUID;
}
