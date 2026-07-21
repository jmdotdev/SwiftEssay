'use client'

import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { CheckCircle, Clock, RotateCcw, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/dashboard/metric-card'
import { DataTable } from '@/components/dashboard/data-table'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { useWriterMetrics, useAvailableOrders } from '@/lib/hooks'
import { toast } from 'sonner'
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
    accessorKey: 'totalPrice',
    header: 'Price',
    cell: ({ row }) => (
      <span className="font-medium">${row.original.totalPrice}</span>
    ),
  },
  {
    accessorKey: 'deadline',
    header: 'Deadline',
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.original.deadline).toLocaleString()}
      </span>
    ),
  },
]

export default function WriterDashboardPage() {
  const router = useRouter()
  const { data: metrics, isLoading: metricsLoading } = useWriterMetrics()
  const { data: availableOrders, isLoading: ordersLoading } = useAvailableOrders()

  const handleRowClick = (order: Order) => {
    const idOnly = (order as any)._id as string
    if (!idOnly) {
      toast.warning('Order has no database id; cannot open details.')
      return
    }
    router.push(`/writer/orders/${idOnly}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your work.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Completed Orders"
          value={metrics?.completedOrders ?? 0}
          icon={CheckCircle}
          description="total completed"
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Pending Orders"
          value={metrics?.pendingOrders ?? 0}
          icon={Clock}
          description="in progress"
          isLoading={metricsLoading}
        />
        <MetricCard
          title="In Revision"
          value={metrics?.inRevision ?? 0}
          icon={RotateCcw}
          description="needs updates"
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Cancelled Orders"
          value={metrics?.cancelledOrders ?? 0}
          icon={XCircle}
          description="cancelled"
          isLoading={metricsLoading}
        />
      </div>

      {/* Available Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Available Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={(availableOrders ?? []).slice(0, 5)}
            isLoading={ordersLoading}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>
    </div>
  )
}
