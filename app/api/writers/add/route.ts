import { connectDB } from "@/lib/mongoose";
import { addWriter } from "@/services/writerService";

export async function POST(request: Request) {
    const { username, email, status } = await request.json();
    await connectDB();
    try {
        const user = await addWriter(username, email, status);
        return Response.json({ message: "Writer added successfully", user });
    } catch (error: any) {
        return new Response(JSON.stringify(error), { status: 400 });
    }
}