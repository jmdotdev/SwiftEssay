import { connectDB } from '@/lib/mongoose'
import { verifyToken } from '@/lib/jwt'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  await connectDB()
  const { token, password } = await request.json()
  if (!token || !password) {
    return new Response(JSON.stringify({ message: 'Token and password are required' }), { status: 400 })
  }
  try {
    const payload: any = verifyToken(token)
    const userId = payload.userId
    if (!userId) throw new Error('Invalid token')
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')
    user.password = await bcrypt.hash(password, 10)
    await user.save()
    return Response.json({ message: 'Password reset successful' })
  } catch (err: any) {
    return new Response(JSON.stringify({ message: 'Invalid or expired token' }), { status: 400 })
  }
}
