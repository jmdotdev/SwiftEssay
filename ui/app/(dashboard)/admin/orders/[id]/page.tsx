'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, DollarSign, User, MessageSquare, UserPlus, Paperclip, FileText, Image, File, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { AssignWriterModal } from '@/components/dashboard/assign-writer-modal'
import { AddCommentModal } from '@/components/dashboard/add-comment-modal'
import { Skeleton } from '@/components/ui/skeleton'
import { useOrder } from '@/lib/hooks'
import { toast } from 'sonner'
import type { Writer } from '@/lib/types'

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) {
    return <Image className="h-5 w-5 text-blue-500" />
  }
  if (type === 'application/pdf' || type.includes('document')) {
    return <FileText className="h-5 w-5 text-red-500" />
  }
  return <File className="h-5 w-5 text-muted-foreground" />
}

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = use(params)
  const { data: order, isLoading } = useOrder(id)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [commentModalOpen, setCommentModalOpen] = useState(false)

  const handleAssign = (writer: Writer) => {
    toast.success(`Assigned ${writer.name} to this order`)
  }

  const handleAddComment = (comment: string) => {
    toast.success('Comment added successfully')
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
          <Link href="/admin/orders">
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

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/admin/orders">
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
        <div className="flex gap-2">
          {!order.assignedWriterId && (
            <Button onClick={() => setAssignModalOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Writer
            </Button>
          )}
          <Button variant="outline" onClick={() => setCommentModalOpen(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Comment
          </Button>
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
                    <div className="text-sm text-muted-foreground">Price</div>
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
          <Card>
            <CardHeader>
              <CardTitle>Review Comments</CardTitle>
              <CardDescription>
                Comments and feedback for this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              {order.comments && order.comments.length > 0 ? (
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
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No comments yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Writer</CardTitle>
            </CardHeader>
            <CardContent>
              {order.assignedWriter ? (
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {order.assignedWriter.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{order.assignedWriter.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.assignedWriter.email}
                    </div>
                    <Link
                      href={`/admin/writers/${order.assignedWriter.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto mb-3">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    No writer assigned yet
                  </p>
                  <Button size="sm" onClick={() => setAssignModalOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Writer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.attachments && order.attachments.length > 0 ? (
                <div className="space-y-2">
                  {order.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50"
                    >
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No attachments
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline</span>
                  <span className="font-medium">
                    {new Date(order.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AssignWriterModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        onAssign={handleAssign}
        orderTitle={order.title}
      />

      <AddCommentModal
        open={commentModalOpen}
        onOpenChange={setCommentModalOpen}
        onSubmit={handleAddComment}
        orderTitle={order.title}
      />
    </div>
  )
}
