import { cookies } from "next/headers";
import isAdmin from "../../(guards)/isAdmin";
import { createOrder } from "@/services/orderService";
import { request } from "https";

export async function addOrder() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isIserAdmin = isAdmin(token as string);
    if (!token || !isIserAdmin) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    const { posted_by, discipline, files, totalPrice, price_per_page, total_pages, deadline } = await request.json();
    try {
        const order = await createOrder(posted_by, discipline, files, totalPrice, price_per_page, total_pages, deadline);
        return Response.json({ message: "Order created successfully", order });
    } catch (error: any) {
        return new Response(JSON.stringify(error), { status: 400 });
    }
}