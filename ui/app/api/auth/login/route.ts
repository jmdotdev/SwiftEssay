import { signToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongoose";
import { loginUser } from "@/services/authService";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    await connectDB();
    const { email, password } = await request.json();
    try {
        const user = await loginUser(email, password);
        const token = signToken({
            id: user._id,
            role: user.role,
        })
         const cookieStore = await cookies();
         cookieStore.set("token", token, {
            httpOnly: true,
            secure: true,
            path: "/",
        })

        return Response.json({ message: "Logged in" })
    } catch (error) {
        console.log('Login error:', error)
        return new Response(JSON.stringify({ error: error }), { status: 400 });
    }
}
