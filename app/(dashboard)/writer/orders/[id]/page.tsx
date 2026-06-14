'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, DollarSign, HandMetal, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useOrder } from '@/lib/hooks'

interface WriterOrderDetailsPageProps {
  params: Promise<{ id: string }>
}

export default function WriterOrderDetailsPage({ params }: WriterOrderDetailsPageProps) {
  const { id } = use(params)
  const { data: order, isLoading } = useOrder(id)

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

  const handleClaim = async () => {
    if (!order) return
    if (claimMutation.isLoading) return
    claimMutation.mutate(id)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/writer/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Order not found</h2>
          <p className="text-muted-foreground">The order you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  const isAvailable = (order?.status && (order.status === 'pending' || order.status === 'unassigned')) && !order.assignedWriterId && !order.assigned_to

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/writer/orders">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{order.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={order.status} />
            <span className="text-sm text-muted-foreground">
              Order #{order.id}
            </span>
          </div>
        </div>
        {isAvailable && (
          <Button onClick={handleClaim} disabled={claimMutation.isLoading}>
            <HandMetal className="h-4 w-4 mr-2" />
            {claimMutation.isLoading ? 'Claiming...' : 'Claim Order'}
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <p>{order.description}</p>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Payout</div>
                    <div className="font-semibold">${order.price}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Deadline</div>
                    <div className="font-semibold">
                      {new Date(order.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          {order.comments && order.comments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Comments</CardTitle>
                <CardDescription>
                  Feedback and revision requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {comment.userName.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={order.status} />
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payout</span>
                  <span className="font-semibold">${order.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline</span>
                  <span>{new Date(order.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {isAvailable && (
                <>
                  <Separator />
                  <Button className="w-full" onClick={handleClaim} disabled={claimMutation.isLoading}>
                    <HandMetal className="h-4 w-4 mr-2" />
                    {claimMutation.isLoading ? 'Claiming...' : 'Claim This Order'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
