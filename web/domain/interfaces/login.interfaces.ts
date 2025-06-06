import { UserProps } from "./user.interfaces";

export interface CreateLogin {
    username: string,
    password: string,
}

export interface LoginProps {
    user: UserProps,
    token: string,
    token_type: string,
}