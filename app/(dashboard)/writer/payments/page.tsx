'use client'

import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DollarSign, Clock, XCircle } from 'lucide-react'
import { MetricCard } from '@/components/dashboard/metric-card'
import { DataTable } from '@/components/dashboard/data-table'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { useWriterPayments, useWriterPaymentMetrics } from '@/lib/hooks'
import type { Payment } from '@/lib/types'

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'orderTitle',
    header: 'Order',
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate font-medium">
        {row.original.orderTitle}
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <span className="font-medium">${row.original.amount}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'paidAt',
    header: 'Paid Date',
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.paidAt 
          ? new Date(row.original.paidAt).toLocaleDateString()
          : '-'}
      </span>
    ),
  },
]

export default function WriterPaymentsPage() {
  const { data: payments, isLoading: paymentsLoading } = useWriterPayments()
  const { data: metrics, isLoading: metricsLoading } = useWriterPaymentMetrics()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Track your earnings and payment history.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Amount"
          value={`$${metrics?.totalPaid ?? 0}`}
          icon={DollarSign}
          description="from paid orders"
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Pending Amount"
          value={`$${metrics?.totalPending ?? 0}`}
          icon={Clock}
          description="awaiting payment"
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Cancelled Amount"
          value={`$${metrics?.totalCancelled ?? 0}`}
          icon={XCircle}
          description="from cancelled orders"
          isLoading={metricsLoading}
        />
      </div>

      {/* Orders Table */}
      <DataTable
        columns={columns}
        data={payments ?? []}
        searchKey="orderTitle"
        searchPlaceholder="Search orders..."
        isLoading={paymentsLoading}
      />
    </div>
  )
}
