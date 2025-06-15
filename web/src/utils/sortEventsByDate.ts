import { EventProps } from "@/domain";

export const sortEventsByDate = (events: EventProps[]) => {
    return events.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
    });
}