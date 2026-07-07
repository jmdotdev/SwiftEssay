import { connectDB } from "@/lib/mongoose"
import { Notification } from "@/models/Notification"
import { User } from "@/models/User"

type NotificationType = 'new_order' | 'order_paid' | 'order_completed'

interface NotifyPayload {
    type: NotificationType
    title: string
    message: string
    link: string
    order?: string
}

export async function notifyUser(recipient: string, payload: NotifyPayload) {
    await connectDB()
    await Notification.create({ recipient, ...payload })
}

export async function notifyRole(role: 'admin' | 'writer', payload: NotifyPayload) {
    await connectDB()
    const users = await User.find({ role, status: 'active' }).select('_id').lean()
    if (users.length === 0) return
    await Notification.insertMany(users.map((u: any) => ({ recipient: u._id, ...payload })))
}
