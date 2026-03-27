'use client'

import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { CheckCircle, Clock, RotateCcw, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/dashboard/metric-card'
import { DataTable } from '@/components/dashboard/data-table'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { useWriterMetrics, useLatestOrders } from '@/lib/hooks'
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
    accessorKey: 'deadline',
    header: 'Deadline',
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.original.deadline).toLocaleDateString()}
      </span>
    ),
  },
]

export default function WriterDashboardPage() {
  const router = useRouter()
  const { data: metrics, isLoading: metricsLoading } = useWriterMetrics()
  const { data: latestOrders, isLoading: ordersLoading } = useLatestOrders(5)

  const handleRowClick = (order: Order) => {
    router.push(`/writer/orders/${order.id}`)
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
          trend={{ value: 12, isPositive: true }}
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

      {/* Latest Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={latestOrders ?? []}
            isLoading={ordersLoading}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>
    </div>
  )
}
