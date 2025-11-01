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
import { MoreHorizontal } from "lucide-react"

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
import { Order } from "@/types/Order"
import { Link } from "react-router-dom"


type OrderTableProps = {
  orders: Order[];
  onDelete?: (id: string) => void;
  openAddPaymentModal: (id: string) => void;
}
export const OrderTable = ({ orders, onDelete, openAddPaymentModal }: OrderTableProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const columns: ColumnDef<Order>[] = [
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
    accessorKey: "academic_level",
    header: () => <div className="text-start">Academic Level</div>,
    cell: ({ row }) => (
      <div className="capitalize text-start">{row.original.academic_level}</div>
    ),
  },
  {
    accessorKey: "discipline",
    header: ({ column }) => {
      return (
        <div>
          <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Discipline
        </Button>
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.original.discipline}</div>
    ),
  },
    {
    accessorKey: "academic_level",
    header: () => <div className="text-start">Page Format</div>,
    cell: ({ row }) => (
      <div className="capitalize text-start">{row.original.page_format}</div>
    ),
  },
  {
    accessorKey: "pages",
    header: () => <div className="text-start">Pages</div>,
    cell: ({ row }) => (
      <div className="capitalize text-start">{row.original.pages}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-start">Amount</div>,
    cell: ({ row }) => (
      <div className="capitalize text-start">{row.original.amount_payable}</div>
    ),
  },
  {
    accessorKey: "Deadline",
    header: () => <div className="text-start">Deadline</div>,
    cell: ({ row }) => (
      <div className="capitalize text-start">{moment(row.original.deadline).format('MMMM Do YYYY, h:mm')}</div>
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
            <DropdownMenuItem className="cursor-pointer"><Link to={`/orders/order-details/${row.original._id}`}>View</Link></DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer"><Link to={`/orders/add-order/${row.original._id}`}>Edit</Link></DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => openAddPaymentModal(row.original._id)}>Add Payment</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 cursor-pointer hover:!text-red-400" onClick={() => onDelete(row.original._id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
 ]
  const table = useReactTable({
    data: orders,
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
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter discipline..."
          value={(table.getColumn("discipline")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("discipline")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="overflow-auto rounded-md border">
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