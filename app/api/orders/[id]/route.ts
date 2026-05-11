import { cookies } from "next/headers";
import { Order } from "@/models/Order";
import { connectDB } from "@/lib/mongoose";
import isAdmin from "../../(guards)/isAdmin";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = isAdmin(token as string);
  
  if (!token || !user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  try {
    await connectDB();
    
    const order = await Order.findById(id)
      .populate('posted_by', 'username email')
      .populate('assigned_to', 'username email');

    if (!order) {
      return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
    }

    return Response.json(order);
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return new Response(JSON.stringify({ message: "Error fetching order", error: error.message }), { status: 400 });
  }
}
