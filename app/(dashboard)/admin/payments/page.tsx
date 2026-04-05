'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DollarSign, Clock, XCircle } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MetricCard } from '@/components/dashboard/metric-card'
import { DataTable } from '@/components/dashboard/data-table'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { usePayments, usePaymentMetrics } from '@/lib/hooks'
import type { Payment } from '@/lib/types'

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'orderTitle',
    header: 'Order',
    cell: ({ row }) => (
      <div className="max-w-[250px] truncate font-medium">
        {row.original.orderTitle}
      </div>
    ),
  },
  {
    accessorKey: 'writerName',
    header: 'Writer',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-xs">
            {row.original.writerName.split(' ').map((n) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <span>{row.original.writerName}</span>
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

export default function PaymentsPage() {
  const { data: payments, isLoading: paymentsLoading } = usePayments()
  const { data: metrics, isLoading: metricsLoading } = usePaymentMetrics()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Track and manage all payments.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Paid"
          value={`$${metrics?.totalPaid ?? 0}`}
          icon={DollarSign}
          description="successfully processed"
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Total Pending"
          value={`$${metrics?.totalPending ?? 0}`}
          icon={Clock}
          description="awaiting payment"
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Total Cancelled"
          value={`$${metrics?.totalCancelled ?? 0}`}
          icon={XCircle}
          description="cancelled payments"
          isLoading={metricsLoading}
        />
      </div>

      {/* Payments Table */}
      <DataTable
        columns={columns}
        data={payments ?? []}
        searchKey="orderTitle"
        searchPlaceholder="Search payments..."
        isLoading={paymentsLoading}
      />
    </div>
  )
}
