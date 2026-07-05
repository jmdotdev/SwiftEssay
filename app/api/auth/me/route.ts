import { verifyToken } from "@/lib/jwt"
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
        return Response.json({ user: null });
    }
    try {
        const decoded = verifyToken(token) as { id: string, role: string };
        await connectDB();
        const user = await User.findById(decoded.id).select('-password').lean() as any;
        if (!user) {
            return Response.json({ user: null });
        }
        return Response.json({
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        return Response.json({ user: null });
    }
}