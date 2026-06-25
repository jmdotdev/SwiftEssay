import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt'
import { connectDB } from '@/lib/mongoose'
import { Order } from '@/models/Order'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 })

  try {
    const decoded = verifyToken(token) as { userId?: string; id?: string; role?: string }
    if (!decoded || decoded.role !== 'writer') {
      return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 })
    }

    const writerId = (decoded.userId as any) || (decoded.id as any)
    if (!writerId) return new Response(JSON.stringify({ message: 'Writer id missing' }), { status: 400 })

    await connectDB()
    const orders = await Order.find({ assigned_to: writerId })
      .populate('posted_by', 'username email')
      .populate('assigned_to', 'username email')
      .sort({ createdAt: -1 })

    return Response.json(orders)
  } catch (err: any) {
    console.error('Error fetching my orders:', err)
    return new Response(JSON.stringify({ message: 'Error fetching my orders', error: err.message }), { status: 400 })
  }
}
