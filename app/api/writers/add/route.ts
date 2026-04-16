import { connectDB } from "@/lib/mongoose";
import { addWriter } from "@/services/writerService";
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    const { username, email, status } = await request.json();
    const token = (await cookies()).get('token')?.value;
    if (!token) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };
    if (decoded.role !== 'admin') {
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