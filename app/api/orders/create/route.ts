import { cookies } from "next/headers";
import isAdmin from "../../(guards)/isAdmin";
import { createOrder } from "@/services/orderService";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = isAdmin(token as string);
  if (!token || !user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const discipline = formData.get('discipline') as string;
    const description = formData.get('description') as string;
    const totalPrice = parseFloat(formData.get('totalPrice') as string);
    const price_per_page = parseFloat(formData.get('price_per_page') as string);
    const total_pages = parseInt(formData.get('total_pages') as string);
    const deadline = formData.get('deadline') as string;
    const files = formData.getAll('files') as File[];

    console.log("Creating order with user.userId:", user.userId);

    // Upload files to Cloudinary
    const uploadedFiles: { url: string; public_id: string }[] = [];
    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'auto', folder: 'orders' },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(Buffer.from(buffer));
      });
      uploadedFiles.push({ url: (result as any).secure_url, public_id: (result as any).public_id });
    }

    const order = await createOrder(user.userId, discipline, uploadedFiles, totalPrice, price_per_page, total_pages, new Date(deadline), title, description);
    return Response.json({ message: "Order created successfully", order });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return new Response(JSON.stringify({ message: "Error creating order", error: error.message }), { status: 400 });
  }
}