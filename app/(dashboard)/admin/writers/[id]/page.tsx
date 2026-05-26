'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowLeft, CheckCircle, Clock, RotateCcw, FileText, Mail, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/dashboard/metric-card'
import { DataTable } from '@/components/dashboard/data-table'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useWriter, useWriterOrders } from '@/lib/hooks'
import type { Order } from '@/lib/types'

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate font-medium">
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
      <span className="font-medium">${(row.original as any).totalPrice ?? (row.original as any).price}</span>
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

interface WriterProfilePageProps {
  params: Promise<{ id: string }>
}

export default function WriterProfilePage({ params }: WriterProfilePageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { data: writer, isLoading: writerLoading } = useWriter(id)
  const { data: orders, isLoading: ordersLoading } = useWriterOrders(id)

  if (writerLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-start gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (!writer) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/admin/writers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Writers
          </Link>
        </Button>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Writer not found</h2>
          <p className="text-muted-foreground">The writer you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  const handleRowClick = (order: Order) => {
    const orderId = (order as any)._id ?? (order as any).id
    if (orderId) router.push(`/admin/orders/${orderId}`)
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/admin/writers">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Writers
        </Link>
      </Button>

      {/* Writer Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {writer.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{writer.name}</h1>
                <StatusBadge status={writer.status} />
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {writer.email}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(writer.createdAt).toLocaleDateString()}
                </div>
              </div>
              {writer.currentActiveTask && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Currently working on</div>
                  <div className="font-medium">{writer.currentActiveTask}</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Completed Tasks"
          value={writer.tasksCompleted}
          icon={CheckCircle}
        />
        <MetricCard
          title="Pending Tasks"
          value={writer.pendingTasks}
          icon={Clock}
        />
        <MetricCard
          title="In Revision"
          value={writer.inRevision}
          icon={RotateCcw}
        />
        <MetricCard
          title="Current Active"
          value={writer.currentActiveTask ? 1 : 0}
          icon={FileText}
        />
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={orders ?? []}
            searchKey="title"
            searchPlaceholder="Search tasks..."
            isLoading={ordersLoading}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>
    </div>
  )
}
