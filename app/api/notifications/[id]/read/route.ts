import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"
import { connectDB } from "@/lib/mongoose"
import { Notification } from "@/models/Notification"

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
    }

    let decoded: { id?: string; userId?: string }
    try {
        decoded = verifyToken(token) as any
    } catch {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
    }

    const userId = decoded.id || decoded.userId
    if (!userId) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
    }

    await connectDB()
    const notification = await Notification.findOneAndUpdate(
        { _id: id, recipient: userId },
        { isRead: true },
        { new: true }
    )

    if (!notification) {
        return new Response(JSON.stringify({ message: "Notification not found" }), { status: 404 })
    }

    return Response.json(notification)
}
