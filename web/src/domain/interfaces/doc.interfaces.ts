import { EventProps } from './event.interfaces';

export interface CreateDoc {
  name: string;
  event_id: number;
  file: File;
  description?: string;
}

export interface UpdateDoc {
  name?: string;
  event_id?: number;
  file?: File;
  description?: string;
}

export interface DocProps {
  id: number;
  name: string;
  event_id: number;
  description?: string;
  uri: string;
  ext: string;
  created_at: string;
  updated_at: string;
  event?: EventProps;
}
