'use client'

import { use } from 'react'
import { WriterOrderDetail } from '@/components/dashboard/writer-order-detail'

interface Props {
  params: Promise<{ id: string }>
}

export default function MyOrderDetailPage({ params }: Props) {
  const { id } = use(params)
  return <WriterOrderDetail id={id} backHref="/writer/my-orders" />
}
