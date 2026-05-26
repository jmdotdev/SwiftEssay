'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { DeleteDialog } from '@/components/dashboard/delete-dialog'
import type { Order } from '@/lib/types'

// Column definitions are created inside OrdersPage so hooks and state are available in cell renderers.

export default function OrdersPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const { data: orders, isLoading } = useOrders()

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const json = await res.json().catch(() => null)
        throw new Error(json?.message || 'Failed to delete order')
      }
      return res.json()
    },
  })

  const handleDeleteOrder = () => {
    if (!selectedOrder) return
    deleteOrderMutation.mutate(selectedOrder._id, {
      onSuccess: async () => {
        toast.success('Order deleted successfully')
        await queryClient.invalidateQueries({ queryKey: ['orders'] })
        setDeleteModalOpen(false)
        setSelectedOrder(null)
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : 'Failed to delete order')
        setDeleteModalOpen(false)
        setSelectedOrder(null)
      },
    })
  }

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
      accessorKey: 'totalPrice',
      header: 'Price',
      cell: ({ row }) => (
        <span className="font-medium">${row.original.totalPrice}</span>
      ),
    },
    {
      accessorKey: 'assigned_to',
      header: 'Assigned Writer',
      cell: ({ row }) => {
        const writer = row.original.assigned_to
        if (!writer) {
          return <span className="text-muted-foreground">Unassigned</span>
        }
        const username = typeof writer === 'string' ? writer : (writer.username || 'Unknown')
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {username.split(' ').map((n) => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{username}</span>
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
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!order.assigned_to && (
                  <>
                    <DropdownMenuItem>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign Writer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href={`/admin/orders/${order._id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedOrder(order)
                    setDeleteModalOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const handleRowClick = (order: Order) => {
    router.push(`/admin/orders/${order._id}`)
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
      <DeleteDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteOrder}
        title="Delete Order"
        message={
          selectedOrder
            ? `Are you sure you want to delete the order “${selectedOrder.title}”? This will remove the order and its uploaded files from Cloudinary and cannot be undone.`
            : 'Are you sure you want to delete this order? This will remove the order and its uploaded files from Cloudinary.'
        }
        confirmText="Delete Order"
      />
    </div>
  )
}
