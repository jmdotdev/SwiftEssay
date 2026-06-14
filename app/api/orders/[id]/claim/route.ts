import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt'
import { connectDB } from '@/lib/mongoose'
import { Order } from '@/models/Order'
import { User } from '@/models/User'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 })
  }

  try {
    const decoded = verifyToken(token) as { userId?: string; role?: string }
    if (!decoded || decoded.role !== 'writer') {
      return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 })
    }

    await connectDB()

    const order = await Order.findById(id)
    if (!order) return new Response(JSON.stringify({ message: 'Order not found' }), { status: 404 })

    if (order.assigned_to || ['assigned', 'in_progress'].includes(String(order.status))) {
      return new Response(JSON.stringify({ message: 'Order already assigned' }), { status: 409 })
    }

    const writer = await User.findById(decoded.userId)
    if (!writer || writer.role !== 'writer') {
      return new Response(JSON.stringify({ message: 'Writer not found' }), { status: 404 })
    }

    order.assigned_to = writer._id
    order.status = 'assigned'
    await order.save()
    const populated = await Order.findById(order._id).populate('posted_by', 'username email').populate('assigned_to', 'username email')

    return Response.json({ message: 'Order claimed successfully', order: populated })
  } catch (err: any) {
    console.error('Error claiming order:', err)
    return new Response(JSON.stringify({ message: 'Error claiming order', error: err.message }), { status: 400 })
  }
}
