import { UserRole } from "../types/UserRole";

export interface CreateUser {
    name: string;
    role: UserRole;
    email: string;
    cpf: string;
    sigle: string;
    password: string;
    active?: boolean;
}

export interface UpdateUser {
    name?: string;
    role?: UserRole;
    email?: string;
    cpf?: string;
    sigle?: string;
    active?: boolean;
    password?: string;
}


export interface UserProps {
    id: number;
    name: string;
    role: UserRole;
    email: string;
    cpf: string;
    sigle: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

