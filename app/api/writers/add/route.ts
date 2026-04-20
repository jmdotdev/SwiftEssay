import { connectDB } from "@/lib/mongoose";
import { addWriter } from "@/services/writerService";
import { cookies } from 'next/headers';
import isAdmin from "../../(guards)/isAdmin";

export async function POST(request: Request) {
    const { username, email, status } = await request.json();
    const token = (await cookies()).get('token')?.value;
    if (!token) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    const isUserAdmin = isAdmin(token);
    if (!isUserAdmin) {
        return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }
    await connectDB();
    try {
        const user = await addWriter(username, email, status);
        return Response.json({ message: "Writer added successfully", user });
    } catch (error: any) {
        return new Response(JSON.stringify(error), { status: 400 });
    }
}