import { cookies } from 'next/headers';
import isAdmin from '../../(guards)/isAdmin';
import { connectDB } from "@/lib/mongoose";
import { updateWriter } from "@/services/writerService";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { username, email, status } = await request.json();
    if (!id) {
        return new Response(JSON.stringify({ message: "Writer ID is required" }), { status: 400 });
    }
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
        const user = await updateWriter(id, username, email, status);
        return Response.json({ message: "Writer updated successfully", user });
    } catch (error: any) {
        return new Response(JSON.stringify(error), { status: 400 });
    }
}