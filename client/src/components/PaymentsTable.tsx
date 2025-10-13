"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import moment from "moment"
import { Payment } from "@/types/Payment"
import { DatePicker } from "./DatePicker"

export const columns: ColumnDef<Payment>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "Code",
        header: () => <div className="text-start">Code</div>,
        cell: ({ row }) => (
            <div className="capitalize text-start">{row.original._id}</div>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <div>
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowUpDown />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{'Sampleemail@gmail.com'}</div>
        ),
    },
    {
        accessorKey: "Amount",
        header: () => <div className="text-start">Amount</div>,
        cell: ({ row }) => (
            <div className="capitalize text-start">{row.original.currency}{row.original.amount}</div>
        ),
    },
    {
        accessorKey: "Method",
        header: () => <div className="text-start">Method</div>,
        cell: ({ row }) => (
            <div className="capitalize text-start">{row.original.method}</div>
        ),
    },
    {
        accessorKey: "Status",
        header: () => <div className="text-start">Status</div>,
        cell: ({ row }) => (
            <div className="capitalize text-start">{row.original.status}</div>
        ),
    },
    {
        accessorKey: "PaidOn",
        header: () => <div className="text-start">PaidOn</div>,
        cell: ({ row }) => (
            <div className="capitalize text-start">{moment(row.original.created_at).format('MMMM Do YYYY')}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        header: () => <div className="text-start"> Actions </div>,
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {/* <DropdownMenuItem className="cursor-pointer">View</DropdownMenuItem> */}
                        <DropdownMenuItem className="text-red-500 cursor-pointer hover:!text-red-400">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

type PaymentTableProps = {
    payments: Payment[]
}
export const PaymentsTable = ({ payments }: PaymentTableProps) => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({});
    const [isFromOpen, setIsFromOpen] = React.useState<boolean>(false)
    const [isToOpen, setIsToOpen] = React.useState<boolean>(false)

    const table = useReactTable({
        data: payments,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row items-center justify-between py-4">
                <Input
                    placeholder="Search email..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("email")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className="flex flex-col w-full md:flex-row items-start md:items-center mt-2 md:mt-0 mx-2">
                    <div className="mr-0 md:mr-2">
                        <DatePicker header="From" isOpen={isFromOpen} setIsOpen={setIsFromOpen} />
                    </div>
                    <div className="mt-2 md:mt-0">
                        <DatePicker header="To" isOpen={isToOpen} setIsOpen={setIsToOpen}/>
                    </div>
                </div>
            </div>
            <div className="rounded-md border overflow-visible">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}