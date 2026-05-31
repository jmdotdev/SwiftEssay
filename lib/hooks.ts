'use client'

import { useQuery } from '@tanstack/react-query'
import {
  mockWriters,
  mockOrders,
  writerMetrics,
} from './mock-data'
import type { Writer, Order, Payment, ChartData, DashboardMetrics, WriterMetrics, PaymentMetrics } from './types'

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Admin hooks
export function useAdminMetrics() {
  return useQuery<DashboardMetrics>({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/orders/get', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to fetch orders')
        const orders = await res.json()

        const totalTasks = Array.isArray(orders) ? orders.length : 0
        const assignedTasks = Array.isArray(orders) ? orders.filter((o: any) => o.assigned_to || o.assignedWriterId).length : 0
        const pendingTasks = Array.isArray(orders) ? orders.filter((o: any) => ['pending', 'unassigned'].includes(String(o.status))).length : 0
        const completedTasks = Array.isArray(orders) ? orders.filter((o: any) => String(o.status) === 'completed').length : 0

        return { totalTasks, assignedTasks, pendingTasks, completedTasks }
      } catch (err) {
        await delay(500)
        return {
          totalTasks: mockOrders.length,
          assignedTasks: mockOrders.filter((o) => (o as any).assignedWriterId).length,
          pendingTasks: mockOrders.filter((o) => (o as any).status === 'pending' || (o as any).status === 'unassigned').length,
          completedTasks: mockOrders.filter((o) => (o as any).status === 'completed').length,
        }
      }
    },
  })
}

export function useChartData() {
  return useQuery<ChartData[]>({
    queryKey: ['chart-data'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/orders/get', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to fetch orders')
        const orders = await res.json()

        const now = new Date()
        const months: { key: string; label: string }[] = []
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
          months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString(undefined, { month: 'short' }) })
        }

        const map = new Map<string, { date: string; tasks: number; completed: number }>()
        months.forEach((m) => map.set(m.key, { date: m.label, tasks: 0, completed: 0 }))

        if (Array.isArray(orders)) {
          orders.forEach((o: any) => {
            const d = o.createdAt ? new Date(o.createdAt) : o.created_at ? new Date(o.created_at) : null
            if (!d || isNaN(d.getTime())) return
            const key = `${d.getFullYear()}-${d.getMonth()}`
            const entry = map.get(key)
            if (entry) {
              entry.tasks += 1
              if (String(o.status) === 'completed') entry.completed += 1
            }
          })
        }

        return Array.from(map.values())
      } catch (err) {
        await delay(600)
        return [
          { date: 'Jan', tasks: 0, completed: 0 },
          { date: 'Feb', tasks: 0, completed: 0 },
          { date: 'Mar', tasks: 0, completed: 0 },
          { date: 'Apr', tasks: 0, completed: 0 },
          { date: 'May', tasks: 0, completed: 0 },
          { date: 'Jun', tasks: 0, completed: 0 },
        ]
      }
    },
  })
}

export function useWriters() {
  return useQuery<Writer[]>({
    queryKey: ['writers'],
    queryFn: async () => {
      const res = await fetch('/api/writers/get', {
        credentials: 'include'
      })
      if (!res.ok) {
        throw new Error('Failed to fetch writers')
      }
      return res.json()
    },
  })
}

export function useWriter(id: string) {
  return useQuery<Writer | null>({
    queryKey: ['writer', id],
    queryFn: async () => {
      const res = await fetch(`/api/writers/${id}`, { credentials: 'include' })
      if (!res.ok) {
        if (res.status === 404) return null
        throw new Error('Failed to fetch writer')
      }
      return res.json()
    },
  })
}

export function useWriterOrders(writerId: string) {
  return useQuery<Order[]>({
    queryKey: ['writer-orders', writerId],
    queryFn: async () => {
      const res = await fetch(`/api/writers/${writerId}/orders`, { credentials: 'include' })
      if (!res.ok) {
        throw new Error('Failed to fetch writer orders')
      }
      return res.json()
    },
  })
}

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders/get', {
        credentials: 'include'
      })
      if (!res.ok) {
        throw new Error('Failed to fetch orders')
      }
      return res.json()
    },
  })
}

export function createOrder(posted_by: string, discipline: string, files: string[], totalPrice: number, price_per_page: number, total_pages: number, deadline: Date) {
  return fetch('/api/orders/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ posted_by, discipline, files, totalPrice, price_per_page, total_pages, deadline }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to create order')
    }
    return res.json()
  }
  )
}
export function useOrder(id: string) {
  return useQuery<Order | undefined>({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${id}`, {
        credentials: 'include'
      })
      if (!res.ok) {
        throw new Error('Failed to fetch order')
      }
      return res.json()
    },
  })
}

export function useAvailableOrders() {
  return useQuery<Order[]>({
    queryKey: ['available-orders'],
    queryFn: async () => {
      await delay(400)
      return mockOrders.filter((o) => {
        const s = o.status as unknown as string
        return (['pending', 'unassigned'] as string[]).includes(s) && !o.assignedWriterId
      })
    },
  })
}

export function usePayments() {
  return useQuery<Payment[]>({
    queryKey: ['payments'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/orders/get', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to fetch orders')
        const orders = await res.json()

        // Transform paid orders to payment records
        const payments: Payment[] = []
        if (Array.isArray(orders)) {
          orders.forEach((order: any) => {
            if (order.isPaid && order.assigned_to) {
              const writerUsername = typeof order.assigned_to === 'string'
                ? order.assigned_to
                : (order.assigned_to.username || 'Unknown')
              
              payments.push({
                id: order._id,
                orderId: order._id,
                orderTitle: order.title,
                writerId: typeof order.assigned_to === 'string' ? order.assigned_to : order.assigned_to._id,
                writerName: writerUsername,
                amount: order.totalPrice,
                status: 'paid',
                paidAt: new Date().toISOString(),
                createdAt: order.createdAt,
              } as any)
            }
          })
        }

        return payments
      } catch (err) {
        await delay(500)
        return []
      }
    },
  })
}

export function usePaymentMetrics() {
  return useQuery<PaymentMetrics>({
    queryKey: ['payment-metrics'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/orders/get', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to fetch orders')
        const orders = await res.json()

        let totalPaid = 0
        let totalPending = 0
        let totalCancelled = 0

        if (Array.isArray(orders)) {
          orders.forEach((order: any) => {
            if (String(order.status) === 'cancelled') {
            } else if (order.isPaid) {
              totalPaid += order.totalPrice || 0
            } else {
              totalPending += order.totalPrice || 0
            }
          })
        }

        return { totalPaid, totalPending, totalCancelled }
      } catch (err) {
        await delay(400)
        return { totalPaid: 0, totalPending: 0, totalCancelled: 0 }
      }
    },
  })
}

// Writer hooks
export function useWriterMetrics() {
  return useQuery<WriterMetrics>({
    queryKey: ['writer-metrics'],
    queryFn: async () => {
      await delay(500)
      return writerMetrics
    },
  })
}

export function useWriterPayments(writerId: string) {
  return useQuery<Payment[]>({
    queryKey: ['writer-payments', writerId],
    queryFn: async () => {
      try {
        const res = await fetch('/api/orders/get', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to fetch orders')
        const orders = await res.json()

        // Filter paid orders assigned to this writer
        const payments: Payment[] = []
        if (Array.isArray(orders)) {
          orders.forEach((order: any) => {
            const assignedToId = typeof order.assigned_to === 'string'
              ? order.assigned_to
              : (order.assigned_to?._id || '')
            
            if (order.isPaid && assignedToId === writerId) {
              const writerUsername = typeof order.assigned_to === 'string'
                ? order.assigned_to
                : (order.assigned_to?.username || 'Unknown')
              
              payments.push({
                id: order._id,
                orderId: order._id,
                orderTitle: order.title,
                writerId: assignedToId,
                writerName: writerUsername,
                amount: order.totalPrice,
                status: 'paid',
                paidAt: new Date().toISOString(),
                createdAt: order.createdAt,
              } as any)
            }
          })
        }

        return payments
      } catch (err) {
        await delay(400)
        return []
      }
    },
  })
}

export function useLatestOrders(limit: number = 5) {
  return useQuery<Order[]>({
    queryKey: ['latest-orders', limit],
    queryFn: async () => {
      await delay(400)
      return mockOrders.slice(0, limit)
    },
  })
}
