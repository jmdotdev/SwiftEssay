import { verifyToken } from "@/lib/jwt"
import { cookies } from "next/headers";
export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
        return Response.json({ user: null });
    }
    try {
        const user = verifyToken(token) as { email: string, role: string };
        return Response.json({ user });
    } catch (error) {
        return Response.json({ user: null });
    }   
}