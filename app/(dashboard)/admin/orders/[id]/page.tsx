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
import { useQueryClient } from '@tanstack/react-query'
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

function getDownloadUrl(url: string) {
  if (/\.(pdf|docx?|txt|rtf|odt)$/i.test(url) && url.includes('/image/upload/')) {
    return url.replace('/image/upload/', '/raw/upload/')
  }
  return url
}

function getDownloadFilename(url: string) {
  const filename = url.split('/').pop() || 'download'
  if (/\.[a-z0-9]+$/i.test(filename)) {
    return filename
  }

  if (/pdf/i.test(url)) {
    return `${filename}.pdf`
  }
  if (/docx?/i.test(url)) {
    return `${filename}.doc`
  }
  if (/txt/i.test(url)) {
    return `${filename}.txt`
  }
  return `${filename}.pdf`
}

async function downloadFile(url: string, filename: string) {
  try {
    const response = await fetch(getDownloadUrl(url))
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`)
    }

    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = objectUrl
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(objectUrl)
  } catch (error) {
    console.error('Download error:', error)
    toast.error('Could not download file. Please try again.')
  }
}

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = use(params)
  const { data: order, isLoading } = useOrder(id)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [commentModalOpen, setCommentModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const handleAssign = async (writer: Writer) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ writerId: writer._id }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.message || 'Failed to assign writer')
      }

      toast.success(`Assigned ${writer.username} to this order`)
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    } catch (error: any) {
      toast.error(error.message || 'Error assigning writer')
    }
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
              Order #{order._id}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setAssignModalOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            {order.assigned_to ? 'Reassign Writer' : 'Assign Writer'}
          </Button>
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
              {order.assigned_to ? (
                <>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {typeof order.assigned_to === 'string' 
                          ? 'AW' 
                          : (order.assigned_to.username || 'AW').split(' ').map((n) => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {typeof order.assigned_to === 'string' 
                          ? order.assigned_to 
                          : order.assigned_to.username}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {typeof order.assigned_to === 'string' 
                          ? 'Writer' 
                          : order.assigned_to.email}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="mt-4" onClick={() => setAssignModalOpen(true)}>
                    Reassign Writer
                  </Button>
                </>
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
              {order.files && order.files.length > 0 ? (
                <div className="space-y-2">
                  {order.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50"
                    >
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.name || file.url.split('/').pop()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => downloadFile(file.url, file.name || getDownloadFilename(file.url))}
                      >
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
