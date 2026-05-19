import { cookies } from "next/headers";
import mongoose from "mongoose";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
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

export async function PATCH(
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
    const { writerId } = await request.json();
    if (!writerId) {
      return new Response(JSON.stringify({ message: "Writer ID is required" }), { status: 400 });
    }

    await connectDB();

    const order = await Order.findById(id);
    if (!order) {
      return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
    }

    const writer = await User.findById(writerId);
    if (!writer || writer.role !== 'writer') {
      return new Response(JSON.stringify({ message: "Writer not found" }), { status: 404 });
    }

    const activeOrder = await Order.findOne({
      assigned_to: writer._id,
      status: { $in: ['assigned', 'in_progress'] },
      _id: { $ne: order._id },
    });

    if (activeOrder) {
      return new Response(JSON.stringify({ message: "This writer already has an active order" }), { status: 409 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        assigned_to: new mongoose.Types.ObjectId(writerId),
        status: 'assigned',
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('posted_by', 'username email')
      .populate('assigned_to', 'username email');

    if (!updatedOrder) {
      return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
    }

    return Response.json({ message: "Order assigned successfully", order: updatedOrder });
  } catch (error: any) {
    console.error("Error assigning writer:", error);
    return new Response(JSON.stringify({ message: "Error assigning writer", error: error.message }), { status: 400 });
  }
}
