'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Edit, Trash2, UserPlus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/dashboard/data-table'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { useOrders } from '@/lib/hooks'
import type { Order } from '@/lib/types'

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className="max-w-[250px] truncate font-medium">
        {row.original.title}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => (
      <span className="font-medium">${row.original.price}</span>
    ),
  },
  {
    accessorKey: 'assignedWriter',
    header: 'Assigned Writer',
    cell: ({ row }) => {
      const writer = row.original.assignedWriter
      if (!writer) {
        return <span className="text-muted-foreground">Unassigned</span>
      }
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {writer.name.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span>{writer.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'deadline',
    header: 'Deadline',
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.original.deadline).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const order = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!order.assignedWriterId && (
              <>
                <DropdownMenuItem>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Writer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function OrdersPage() {
  const router = useRouter()
  const { data: orders, isLoading } = useOrders()

  const handleRowClick = (order: Order) => {
    router.push(`/admin/orders/${order.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage all orders and assign writers.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/orders/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={orders ?? []}
        searchKey="title"
        searchPlaceholder="Search orders..."
        isLoading={isLoading}
        onRowClick={handleRowClick}
      />
    </div>
  )
}
