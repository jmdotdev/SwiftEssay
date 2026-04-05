'use client'

import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { Eye, HandMetal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/dashboard/data-table'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { useAvailableOrders } from '@/lib/hooks'
import { toast } from 'sonner'
import type { Order } from '@/lib/types'

export default function WriterOrdersPage() {
  const router = useRouter()
  const { data: orders, isLoading } = useAvailableOrders()

  const handleClaim = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation()
    toast.success(`Successfully claimed "${order.title}"`)
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
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate text-muted-foreground">
          {row.original.description}
        </div>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => (
        <span className="font-medium">${row.original.price}</span>
      ),
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/writer/orders/${order.id}`)
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              onClick={(e) => handleClaim(order, e)}
            >
              <HandMetal className="h-4 w-4 mr-1" />
              Claim
            </Button>
          </div>
        )
      },
    },
  ]

  const handleRowClick = (order: Order) => {
    router.push(`/writer/orders/${order.id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Available Orders</h1>
        <p className="text-muted-foreground">
          Browse and claim available orders.
        </p>
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
