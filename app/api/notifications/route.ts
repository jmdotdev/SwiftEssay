import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"
import { connectDB } from "@/lib/mongoose"
import { Notification } from "@/models/Notification"

export async function GET() {
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
    const notifications = await Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean()

    return Response.json(notifications)
}
