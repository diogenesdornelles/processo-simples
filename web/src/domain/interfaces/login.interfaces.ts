import { UserProps } from './user.interfaces';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginProps {
  user: UserProps;
  token: string;
  token_type: string;
  success?: boolean;
  message?: string;
}
