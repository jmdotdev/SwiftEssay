'use client'

import { useQuery } from '@tanstack/react-query'
import {
  mockWriters,
  mockOrders,
  mockPayments,
  mockChartData,
  adminMetrics,
  writerMetrics,
  paymentMetrics,
} from './mock-data'
import type { Writer, Order, Payment, ChartData, DashboardMetrics, WriterMetrics, PaymentMetrics } from './types'

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Admin hooks
export function useAdminMetrics() {
  return useQuery<DashboardMetrics>({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      await delay(500)
      return adminMetrics
    },
  })
}

export function useChartData() {
  return useQuery<ChartData[]>({
    queryKey: ['chart-data'],
    queryFn: async () => {
      await delay(600)
      return mockChartData
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
  return useQuery<Writer | undefined>({
    queryKey: ['writer', id],
    queryFn: async () => {
      await delay(300)
      return mockWriters.find((w) => w._id === id)
    },
  })
}

export function useWriterOrders(writerId: string) {
  return useQuery<Order[]>({
    queryKey: ['writer-orders', writerId],
    queryFn: async () => {
      await delay(400)
      return mockOrders.filter((o) => o.assignedWriterId === writerId)
    },
  })
}

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      await delay(500)
      return mockOrders
    },
  })
}

export function useOrder(id: string) {
  return useQuery<Order | undefined>({
    queryKey: ['order', id],
    queryFn: async () => {
      await delay(300)
      return mockOrders.find((o) => o.id === id)
    },
  })
}

export function useAvailableOrders() {
  return useQuery<Order[]>({
    queryKey: ['available-orders'],
    queryFn: async () => {
      await delay(400)
      return mockOrders.filter((o) => o.status === 'pending' && !o.assignedWriterId)
    },
  })
}

export function usePayments() {
  return useQuery<Payment[]>({
    queryKey: ['payments'],
    queryFn: async () => {
      await delay(500)
      return mockPayments
    },
  })
}

export function usePaymentMetrics() {
  return useQuery<PaymentMetrics>({
    queryKey: ['payment-metrics'],
    queryFn: async () => {
      await delay(400)
      return paymentMetrics
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
      await delay(400)
      return mockPayments.filter((p) => p.writerId === writerId)
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
