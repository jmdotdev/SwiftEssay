import { connectDB } from "@/lib/mongoose";
import { registerUser } from "@/services/authService";

export async function POST(request: Request) {
    await connectDB();
    const { username, email, password } = await request.json();
    try {
        const user = await registerUser(username, email, password);
        return Response.json({ message: "User registered successfully", user });
    } catch (error: any) {
        return new Response(JSON.stringify(error), { status: 400 });
    }
}