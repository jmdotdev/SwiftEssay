import { WriterFilter } from "@/types/WritersFilters";

export const writersFilters: WriterFilter[] = [
    {
         id: 1,
        name: 'All',
        isActive: false
    },
    {
        id: 2,
        name: 'Assigned',
        isActive: true
    },
    {
        id: 3,
        name: 'UnAssigned',
        isActive: false
    },
    {
        id: 4,
        name: 'Active',
        isActive: false
    },
    {
        id: 5,
        name: 'Inactive',
        isActive: false
    }
]