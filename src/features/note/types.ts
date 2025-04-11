import { UUID } from '../../features/shared/types';

export interface Note {
  id?: UUID;
  name?: string;
  description: string;
  categoryId?: UUID;
  color: string;
  x?: number;
  y?: number;
}

export interface NoteFormValues {
  name: string;
  description: string;
  color: string;
}
