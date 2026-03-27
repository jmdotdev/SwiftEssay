'use client'

import { FileText, CheckCircle, Clock, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/dashboard/metric-card'
import { useAdminMetrics, useChartData } from '@/lib/hooks'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts'

const chartConfig = {
  tasks: {
    label: 'Total Tasks',
    color: 'var(--chart-1)',
  },
  completed: {
    label: 'Completed',
    color: 'var(--chart-2)',
  },
}

export default function AdminDashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics()
  const { data: chartData, isLoading: chartLoading } = useChartData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your platform.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Tasks"
          value={metrics?.totalTasks ?? 0}
          icon={FileText}
          description="from last month"
          trend={{ value: 12, isPositive: true }}
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Assigned Tasks"
          value={metrics?.assignedTasks ?? 0}
          icon={Users}
          description="currently active"
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Pending Tasks"
          value={metrics?.pendingTasks ?? 0}
          icon={Clock}
          description="awaiting assignment"
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Completed Tasks"
          value={metrics?.completedTasks ?? 0}
          icon={CheckCircle}
          description="this month"
          trend={{ value: 8, isPositive: true }}
          isLoading={metricsLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Task Trends</CardTitle>
            <CardDescription>
              Overview of tasks created and completed over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs text-muted-foreground"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs text-muted-foreground"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    stroke="var(--chart-1)"
                    fill="url(#fillTasks)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="var(--chart-2)"
                    fill="url(#fillCompleted)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>
              Comparison of tasks vs completed work
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs text-muted-foreground"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs text-muted-foreground"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="tasks" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
