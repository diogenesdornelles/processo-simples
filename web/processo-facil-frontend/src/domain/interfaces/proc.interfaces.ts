import { ProcPriority } from "../types/ProcPriority";
import { ProcStatus } from "../types/ProcStatus";
import { EventProps } from "./event.interfaces";
import { UserProps } from "./user.interfaces";

export interface CreateProc {
    user_id: number;
    owner: string;
    description: string;
    status: ProcStatus;
    priority: ProcPriority;
    term: string;
}

export interface UpdateProc {
    user_id?: number;
    owner?: string;
    description?: string;
    status?: ProcStatus;
    priority?: ProcPriority;
    term?: string;
    active?: boolean;
}

export interface ProcProps {
    id: number;
    number: string;
    user_id: number;
    owner: string;
    description: string;
    status: ProcStatus;
    priority: ProcPriority;
    term: string;
    active: boolean;
    updated_at: string;
    created_at: string;
    user: UserProps;
    events: EventProps[];
}
