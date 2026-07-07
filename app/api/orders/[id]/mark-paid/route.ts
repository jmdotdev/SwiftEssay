import { cookies } from "next/headers";
import isAdmin from "../../../(guards)/isAdmin";
import { Order } from "@/models/Order";
import { connectDB } from "@/lib/mongoose";
import { notifyUser } from "@/lib/notify";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = isAdmin(token as string);

  if (!token || !user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    await connectDB();

    const body = await request.json();
    const { isPaid } = body;

    if (typeof isPaid !== "boolean") {
      return new Response(
        JSON.stringify({ message: "isPaid must be a boolean" }),
        { status: 400 }
      );
    }

    const existing = await Order.findById(id);

    if (!existing) {
      return new Response(JSON.stringify({ message: "Order not found" }), {
        status: 404,
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { isPaid },
      { new: true }
    );

    if (isPaid && !existing.isPaid && order.assigned_to) {
      await notifyUser(String(order.assigned_to), {
        type: 'order_paid',
        title: 'Order marked as paid',
        message: `${order.title} - $${order.totalPrice}`,
        link: `/writer/my-orders/${order._id}`,
        order: order._id.toString(),
      });
    }

    return Response.json(order);
  } catch (error: any) {
    console.error("Error updating order paid status:", error);
    return new Response(
      JSON.stringify({
        message: "Error updating order paid status",
        error: error.message,
      }),
      { status: 400 }
    );
  }
}
