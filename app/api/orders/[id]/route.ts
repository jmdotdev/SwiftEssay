import { cookies } from "next/headers";
import mongoose from "mongoose";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { connectDB } from "@/lib/mongoose";
import isAdmin from "../../(guards)/isAdmin";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
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

    await connectDB();

    const order = await Order.findById(id);
    if (!order) {
      return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
    }

    if (writerId === null) {
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        {
          assigned_to: null,
          status: 'unassigned',
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

      return Response.json({ message: "Order unassigned successfully", order: updatedOrder });
    }

    // Handle assignment (writerId is provided)
    if (!writerId) {
      return new Response(JSON.stringify({ message: "Writer ID is required" }), { status: 400 });
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

export async function PUT(
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

    const order = await Order.findById(id);
    if (!order) {
      return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const discipline = formData.get('discipline') as string;
    const description = formData.get('description') as string;
    const totalPrice = parseFloat(formData.get('totalPrice') as string);
    const price_per_page = parseFloat(formData.get('price_per_page') as string);
    const total_pages = parseInt(formData.get('total_pages') as string);
    const deadline = formData.get('deadline') as string;
    const newFiles = formData.getAll('files') as File[];
    const existingFileIds = JSON.parse(formData.get('existingFileIds') as string || '[]');
    const removedFileIds = JSON.parse(formData.get('removedFileIds') as string || '[]');

    let uploadedFiles: Array<{ url: string; public_id: string; name: string }> = [];
    
    if (Array.isArray(existingFileIds) && existingFileIds.length > 0) {
      const keptFiles = (order.files || []).filter((file: any) => {
        const isKept = existingFileIds.includes(file.public_id || file._id?.toString());
        return isKept && file.url && file.public_id && file.name;
      });
      uploadedFiles = keptFiles.map((file: any) => ({
        url: file.url,
        public_id: file.public_id,
        name: file.name,
      }));
    }

    // Delete removed files from Cloudinary
    for (const fileId of removedFileIds) {
      if (!fileId) continue;
      try {
        await new Promise<void>((resolve, reject) => {
          cloudinary.uploader.destroy(fileId, (error: any) => {
            if (error) reject(error);
            else resolve();
          });
        });
      } catch (err) {
        console.error(`Failed to delete file ${fileId} from Cloudinary:`, err);
      }
    }

    // Upload new files
    for (const file of newFiles) {
      if (file.size > 0) {
        const buffer = await file.arrayBuffer();
        const resourceType = file.type.startsWith('image/') ? 'image' : 'raw';
        const result = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: resourceType, folder: 'orders' },
            (error: any, result: any) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(Buffer.from(buffer));
        });
        uploadedFiles.push({
          url: (result as any).secure_url,
          public_id: (result as any).public_id,
          name: file.name,
        });
      }
    }
    // Update order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        title,
        discipline,
        description,
        totalPrice,
        price_per_page,
        total_pages,
        deadline: new Date(deadline),
        files: uploadedFiles.length > 0 ? uploadedFiles : [],
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

    return Response.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return new Response(JSON.stringify({ message: "Error updating order", error: error.message }), { status: 400 });
  }
}

export async function DELETE(
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

    const order = await Order.findById(id);
    if (!order) {
      return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
    }

    // Prevent deleting orders that are assigned to a writer
    if (order.assigned_to) {
      return new Response(JSON.stringify({ message: "Cannot delete order while it is assigned to a writer. Unassign the writer first." }), { status: 409 });
    }

    const files = order.files || [];
    for (const file of files) {
      if (!file?.public_id) continue;
      const resourceType = typeof file.url === 'string' && file.url.includes('/raw/upload/') ? 'raw' : 'image';
      try {
        await new Promise<void>((resolve, reject) => {
          cloudinary.uploader.destroy(
            file.public_id,
            { resource_type: resourceType },
            (error: any) => {
              if (error) reject(error);
              else resolve();
            }
          );
        });
      } catch (err) {
        console.error(`Failed to delete Cloudinary file ${file.public_id}:`, err);
      }
    }

    await Order.findByIdAndDelete(id);

    return Response.json({ message: "Order deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return new Response(JSON.stringify({ message: "Error deleting order", error: error.message }), { status: 400 });
  }
}
