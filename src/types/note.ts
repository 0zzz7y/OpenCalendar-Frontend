export default interface Note {
  color: string;
  id: string;
  description?: string;
  drawing?: string;
  categoryId?: string;
  calendarId?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}
