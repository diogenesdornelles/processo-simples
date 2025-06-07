import { ProcProps } from './proc.interfaces';
import { UserProps } from './user.interfaces';

export interface CreateEvent {
  name: string;
  user_id: number;
  proc_id: number;
  active?: boolean;
}

export interface UpdateEvent {
  name?: string;
  user_id?: number;
  proc_id?: number;
  active?: boolean;
}

export interface EventProps {
  id: number;
  name: string;
  user_id: number;
  proc_id: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  user?: UserProps;
  proc?: ProcProps;
  docs: [];
}
