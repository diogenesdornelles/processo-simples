export interface CreateUser {
    name: string;
    role: string;
    email: string;
    cpf: string;
    sigle: string;
    password: string;
}

export interface UpdateUser {
    name?: string;
    role?: string;
    email?: string;
    cpf?: string;
    sigle?: string;
    active?: boolean;
    password?: string;
}


export interface UserProps {
    id: number;
    name: string;
    role: string;
    email: string;
    cpf: string;
    sigle: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

