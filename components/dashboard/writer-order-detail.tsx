'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  HandMetal,
  Upload,
  Pencil,
  X,
  FileText,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useOrder } from '@/lib/hooks'
import { SubmitFilesModal } from '@/components/dashboard/submit-files-modal'
import type { OrderFile } from '@/lib/types'

interface WriterOrderDetailProps {
  id: string
  backHref: string
}

export function WriterOrderDetail({ id, backHref }: WriterOrderDetailProps) {
  const { data: order, isLoading } = useOrder(id)
  const [submitModalOpen, setSubmitModalOpen] = useState(false)

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me')
      if (!res.ok) return null
      return res.json()
    },
  })

  const queryClient = useQueryClient()

  const invalidateOrder = () => {
    queryClient.invalidateQueries({ queryKey: ['order', id] })
    queryClient.invalidateQueries({ queryKey: ['my-orders'] })
  }

  const claimMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const res = await fetch(`/api/orders/${orderId}/claim`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || 'Failed to claim order')
      }
      return res.json()
    },
    onSuccess: async (_data, orderId) => {
      toast.success('Order claimed')
      queryClient.invalidateQueries({ queryKey: ['available-orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Could not claim order')
    },
  })

  const deleteFileMutation = useMutation({
    mutationFn: async (public_id: string) => {
      const res = await fetch(`/api/orders/${id}/submit`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || 'Failed to remove file')
      }
    },
    onSuccess: (_data, public_id) => {
      toast.success('File removed')
      queryClient.setQueryData(['order', id], (old: any) =>
        old
          ? {
              ...old,
              submitted_files: (old.submitted_files || []).filter(
                (f: any) => f.public_id !== public_id
              ),
            }
          : old
      )
      invalidateOrder()
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Could not remove file')
    },
  })

  const myId = me?.user?.id

  const assignedToId =
    order?.assigned_to && typeof order.assigned_to === 'object'
      ? (order.assigned_to as any)._id
      : order?.assigned_to

  const isAssignedToMe = Boolean(myId && assignedToId && String(assignedToId) === String(myId))

  const submittedFiles: OrderFile[] = (order as any)?.submitted_files ?? []
  const hasSubmitted = submittedFiles.length > 0

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
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Order not found</h2>
          <p className="text-muted-foreground">
            The order you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    )
  }

  const isAvailable =
    (order.status === 'pending' || order.status === 'unassigned') &&
    !order.assignedWriterId &&
    !order.assigned_to

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href={backHref}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{order.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={order.status} />
            <span className="text-sm text-muted-foreground">Order #{order.id || order._id}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {isAvailable && (
            <Button onClick={() => claimMutation.mutate(id)} disabled={claimMutation.isPending}>
              <HandMetal className="h-4 w-4 mr-2" />
              {claimMutation.isPending ? 'Claiming…' : 'Claim Order'}
            </Button>
          )}
          {isAssignedToMe && !hasSubmitted && (
            <Button onClick={() => setSubmitModalOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Submit Work
            </Button>
          )}
          {isAssignedToMe && hasSubmitted && (
            <Button variant="outline" onClick={() => setSubmitModalOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Submission
            </Button>
          )}
        </div>
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
                    <div className="font-semibold">${order.totalPrice}</div>
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

          {/* Submitted files — visible once the writer has submitted */}
          {isAssignedToMe && hasSubmitted && (
            <Card>
              <CardHeader>
                <CardTitle>Submitted Files</CardTitle>
                <CardDescription>Files you have submitted for this order</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {submittedFiles.map((file) => (
                    <li
                      key={file.public_id}
                      className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-1 ml-2 shrink-0">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => deleteFileMutation.mutate(file.public_id)}
                          disabled={deleteFileMutation.isPending}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Review comments */}
          {order.comments && order.comments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Comments</CardTitle>
                <CardDescription>Feedback and revision requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {comment.userName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>
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
                  <span className="font-semibold">${order.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline</span>
                  <span>{new Date(order.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                {hasSubmitted && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Files submitted</span>
                      <span className="font-semibold">{submittedFiles.length}</span>
                    </div>
                  </>
                )}
              </div>

              {isAvailable && (
                <>
                  <Separator />
                  <Button
                    className="w-full"
                    onClick={() => claimMutation.mutate(id)}
                    disabled={claimMutation.isPending}
                  >
                    <HandMetal className="h-4 w-4 mr-2" />
                    {claimMutation.isPending ? 'Claiming…' : 'Claim This Order'}
                  </Button>
                </>
              )}
              {isAssignedToMe && !hasSubmitted && (
                <>
                  <Separator />
                  <Button className="w-full" onClick={() => setSubmitModalOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Work
                  </Button>
                </>
              )}
              {isAssignedToMe && hasSubmitted && (
                <>
                  <Separator />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSubmitModalOpen(true)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Submission
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <SubmitFilesModal
        open={submitModalOpen}
        onOpenChange={setSubmitModalOpen}
        orderId={id}
        orderTitle={order.title}
        existingFiles={submittedFiles}
        onFilesChanged={invalidateOrder}
      />
    </div>
  )
}
