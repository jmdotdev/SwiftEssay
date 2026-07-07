import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt'
import { connectDB } from '@/lib/mongoose'
import { Order } from '@/models/Order'
import { notifyRole } from '@/lib/notify'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function getWriterId(token: string): Promise<string | null> {
  try {
    const decoded = verifyToken(token) as any
    if (!decoded || decoded.role !== 'writer') return null
    return decoded.id || decoded.userId || null
  } catch {
    return null
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 })

  const writerId = await getWriterId(token)
  if (!writerId) return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 })

  await connectDB()
  const order = await Order.findById(id)
  if (!order) return new Response(JSON.stringify({ message: 'Order not found' }), { status: 404 })

  if (String(order.assigned_to) !== String(writerId)) {
    return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 })
  }

  const formData = await request.formData()
  const files = formData.getAll('files') as File[]

  const uploaded: Array<{ url: string; public_id: string; name: string }> = []

  for (const file of files) {
    if (file.size === 0) continue
    const buffer = await file.arrayBuffer()
    const resourceType = file.type.startsWith('image/') ? 'image' : 'raw'
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: resourceType, folder: 'order-submissions' }, (err, res) => {
          if (err) reject(err)
          else resolve(res)
        })
        .end(Buffer.from(buffer))
    })
    uploaded.push({ url: result.secure_url, public_id: result.public_id, name: file.name })
  }

  if (uploaded.length === 0) {
    return new Response(JSON.stringify({ message: 'No valid files provided' }), { status: 400 })
  }

  const updated = await Order.findByIdAndUpdate(
    id,
    {
      $push: { submitted_files: { $each: uploaded } },
      $set: { status: 'completed' },
    },
    { new: true }
  )

  await notifyRole('admin', {
    type: 'order_completed',
    title: 'Order completed',
    message: `${updated.title} has been submitted for review`,
    link: `/admin/orders/${updated._id}`,
    order: updated._id.toString(),
  })

  return Response.json({ submitted_files: updated.submitted_files })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 })

  const writerId = await getWriterId(token)
  if (!writerId) return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 })

  await connectDB()
  const order = await Order.findById(id)
  if (!order) return new Response(JSON.stringify({ message: 'Order not found' }), { status: 404 })

  if (String(order.assigned_to) !== String(writerId)) {
    return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 })
  }

  const { public_id } = await request.json()
  if (!public_id) {
    return new Response(JSON.stringify({ message: 'public_id is required' }), { status: 400 })
  }

  const fileEntry = (order.submitted_files || []).find((f: any) => f.public_id === public_id)
  const resourceType =
    fileEntry && typeof fileEntry.url === 'string' && fileEntry.url.includes('/raw/upload/')
      ? 'raw'
      : 'image'

  try {
    await new Promise<void>((resolve, reject) => {
      cloudinary.uploader.destroy(public_id, { resource_type: resourceType }, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  } catch (err) {
    console.error('Failed to delete from Cloudinary:', err)
  }

  await Order.findByIdAndUpdate(id, { $pull: { submitted_files: { public_id } } })

  return Response.json({ message: 'File removed successfully' })
}
