import { WriterFilter } from "@/types/WritersFilters";

export const writersFilters: WriterFilter[] = [
    {
        id: 1,
        name: 'Assigned',
        isActive: true
    },
    {
        id: 2,
        name: 'UnAssigned',
        isActive: false
    },
    {
        id: 3,
        name: 'Active',
        isActive: false
    },
    {
        id: 4,
        name: 'Inactive',
        isActive: false
    }
]