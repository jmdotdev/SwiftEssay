'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { OrderForm } from '@/components/dashboard/order-form'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

interface OrderData {
  _id: string
  title: string
  description: string
  discipline: string
  totalPrice: number
  price_per_page: number
  total_pages: number
  deadline: string
  files: Array<{
    url: string
    public_id: string
    name: string
  }>
}

export default function EditOrderPage() {
  const params = useParams()
  const orderId = params.id as string
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/orders/${orderId}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch order')
        }

        const data = await response.json()
        
        // Format deadline to YYYY-MM-DDTHH:mm for the datetime-local input field
        const deadline = new Date(data.deadline)
        const formattedDeadline = deadline.toISOString().slice(0, 16)

        setOrderData({
          ...data,
          deadline: formattedDeadline,
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred'
        setError(message)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error || !orderData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-muted-foreground mt-2">
            {error || 'Order not found'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <OrderForm
      initialData={{
        id: orderData._id,
        title: orderData.title,
        description: orderData.description,
        discipline: orderData.discipline,
        totalPrice: orderData.totalPrice,
        price_per_page: orderData.price_per_page,
        total_pages: orderData.total_pages,
        deadline: orderData.deadline,
        files: orderData.files,
      }}
      isEditing={true}
    />
  )
}
