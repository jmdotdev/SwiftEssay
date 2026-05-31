import { cookies } from "next/headers";
import isAdmin from "../../../(guards)/isAdmin";
import { Order } from "@/models/Order";
import { connectDB } from "@/lib/mongoose";

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

    const order = await Order.findByIdAndUpdate(
      id,
      { isPaid },
      { new: true }
    );

    if (!order) {
      return new Response(JSON.stringify({ message: "Order not found" }), {
        status: 404,
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
