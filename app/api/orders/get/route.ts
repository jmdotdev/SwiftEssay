import { cookies } from "next/headers";
import isAdmin from "../../(guards)/isAdmin";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { connectDB } from "@/lib/mongoose";
export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = isAdmin(token as string);
  if (!token || !user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  try {
    await connectDB();
    
    const orders = await Order.find()
      .populate('posted_by', 'username email')
      .populate('assigned_to', 'username email')
      .sort({ createdAt: -1 });

    return Response.json(orders);
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return new Response(JSON.stringify({ message: "Error fetching orders", error: error.message }), { status: 400 });
  }
}
