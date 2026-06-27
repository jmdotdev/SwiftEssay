'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/dashboard/data-table'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import type { Order } from '@/lib/types'

export default function MyOrdersPage() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me')
      if (!res.ok) return null
      return res.json()
    },
  })

  useEffect(() => {
    if (!me) return
    const user = (me.user ?? me) as any
    if (!user || user.role !== 'writer') {
      toast.error('Access denied')
      router.push('/')
    }
  }, [me, router])

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders/my', { credentials: 'include' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || 'Failed to fetch orders')
      }
      return res.json()
    },
  })

  const filtered = useMemo(() => {
    if (!orders) return []
    if (statusFilter === 'all') return orders
    if (statusFilter === 'active') return orders.filter(o => ['assigned', 'in_progress'].includes(String(o.status)))
    return orders.filter(o => String(o.status) === statusFilter)
  }, [orders, statusFilter])

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate font-medium">{row.original.title}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'price',
      header: 'Payout',
      cell: ({ row }) => <span className="font-medium">${row.original.price}</span>,
    },
    {
      accessorKey: 'deadline',
      header: 'Deadline',
      cell: ({ row }) => <span className="text-muted-foreground">{new Date(row.original.deadline).toLocaleDateString()}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Button variant="outline" size="sm" onClick={() => router.push(`/writer/my-orders/${row.original._id || row.original.id}`)}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground">Orders you've worked on or are assigned to.</p>
      </div>

      <DataTable
        columns={columns}
        data={filtered ?? []}
        searchKey="title"
        searchPlaceholder="Search my orders..."
        isLoading={isLoading}
        onRowClick={(o) => router.push(`/writer/my-orders/${o._id || o.id}`)}
        toolbar={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="revision">Revision</option>
            <option value="cancelled">Cancelled</option>
          </select>
        }
      />
    </div>
  )
}
