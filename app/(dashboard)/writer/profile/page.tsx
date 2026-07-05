'use client'

import { Camera, CheckCircle, RotateCcw, XCircle, ClipboardCheck, Mail, Calendar, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MetricCard } from '@/components/dashboard/metric-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser, useWriterMetrics } from '@/lib/hooks'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function WriterProfilePage() {
  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { data: metrics, isLoading: metricsLoading } = useWriterMetrics()

  const completed = metrics?.completedOrders ?? 0
  const cancelled = metrics?.cancelledOrders ?? 0
  const inRevision = metrics?.inRevision ?? 0
  const finished = completed + cancelled
  const rating = finished > 0 ? Math.round((completed / finished) * 5 * 10) / 10 : 0

  const initials = (user?.username || 'Writer')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Your writer profile and order performance.
        </p>
      </div>

      {/* Profile Info Card */}
      <Card>
        <CardContent className="pt-6">
          {userLoading ? (
            <div className="flex items-start gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-6">
              <div className="relative inline-block shrink-0">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => toast.info('Photo upload coming soon')}
                  aria-label="Change profile photo"
                  className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{user?.username || 'Writer'}</h2>
                  <Badge variant="secondary" className="capitalize">Writer</Badge>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {user?.email}
                  </div>
                  {user?.createdAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Completed Orders"
          value={completed}
          icon={CheckCircle}
          description="successfully delivered"
          isLoading={metricsLoading}
        />
        <MetricCard
          title="In Revision"
          value={inRevision}
          icon={RotateCcw}
          description="needs updates"
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Cancelled Orders"
          value={cancelled}
          icon={XCircle}
          description="cancelled"
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Finished Orders"
          value={finished}
          icon={ClipboardCheck}
          description="completed + cancelled"
          isLoading={metricsLoading}
        />
      </div>

      {/* Rating */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Rating</CardTitle>
        </CardHeader>
        <CardContent>
          {metricsLoading ? (
            <Skeleton className="h-10 w-40" />
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-6 w-6',
                      i < Math.round(rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground'
                    )}
                  />
                ))}
              </div>
              <span className="text-xl font-bold">{rating.toFixed(1)} / 5</span>
              <span className="text-sm text-muted-foreground">
                {finished > 0
                  ? `based on ${completed} completed and ${cancelled} cancelled orders`
                  : 'no completed or cancelled orders yet'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
