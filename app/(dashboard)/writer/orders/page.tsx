'use client'

import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { Eye, HandMetal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/dashboard/data-table'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { toast } from 'sonner'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import type { Order } from '@/lib/types'
import { useAvailableOrders } from '@/lib/hooks'

export default function WriterOrdersPage() {
  const router = useRouter()
  const { data: orders, isLoading } = useAvailableOrders()
  const queryClient = useQueryClient()

  const claimMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const res = await fetch(`/api/orders/${orderId}/claim`, { method: 'POST', credentials: 'include' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || 'Failed to claim order')
      }
      return res.json()
    },
    onSuccess: async (_data, orderId) => {
      toast.success('Order claimed')
      await queryClient.invalidateQueries({ queryKey: ['available-orders'] })
      await queryClient.invalidateQueries({ queryKey: ['orders'] })
      await queryClient.invalidateQueries({ queryKey: ['order', orderId] })
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Could not claim order')
    },
  })

  const handleClaim = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation()
    const idOnly = order._id as string
    if (!idOnly) {
      toast.warning('Order has no database id; cannot claim.')
      return
    }
    if (claimMutation.isLoading) return
    claimMutation.mutate(idOnly)
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
        const orderId = order._id as string
        const isAvailable = (['pending', 'unassigned'] as string[]).includes(String(order.status)) && !order.assigned_to && !order.assignedWriterId
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                const idOnly = order._id as string
                if (!idOnly) {
                  toast.warning('Order has no database id; cannot open details.')
                  return
                }
                router.push(`/writer/orders/${idOnly}`)
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
                {isAvailable && (
                  <Button
                    size="sm"
                    onClick={(e) => handleClaim(order, e)}
                    disabled={claimMutation.isLoading}
                  >
                    <HandMetal className="h-4 w-4 mr-1" />
                    {claimMutation.isLoading ? 'Claiming...' : 'Claim'}
                  </Button>
                )}
          </div>
        )
      },
    },
  ]

  const handleRowClick = (order: Order) => {
    const idOnly = order._id as string
    if (!idOnly) {
      toast.warning('Order has no database id; cannot open details.')
      return
    }
    router.push(`/writer/orders/${idOnly}`)
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
