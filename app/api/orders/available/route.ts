import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt'
import { connectDB } from '@/lib/mongoose'
import { Order } from '@/models/Order'

export async function GET() {
  // Public endpoint: return available (unassigned/pending) orders.
  // This intentionally does not require authentication so clients can display available orders.

  try {
    await connectDB()
    const orders = await Order.find({ status: { $in: ['pending', 'unassigned'] }, assigned_to: null })
      .populate('posted_by', 'username email')
      .sort({ createdAt: -1 })

    return Response.json(orders)
  } catch (err: any) {
    console.error('Error fetching available orders:', err)
    return new Response(JSON.stringify({ message: 'Error fetching available orders', error: err.message }), { status: 400 })
  }
}
