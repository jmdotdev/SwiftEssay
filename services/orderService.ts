import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { notifyRole } from "@/lib/notify";

export async function createOrder(posted_by: string, discipline: string, files: { url: string; public_id: string; name: string }[], totalPrice: number, price_per_page: number, total_pages: number, deadline: Date, title?: string, description?: string, isPaid: boolean = false) {
    const order = new Order({ 
        posted_by: new mongoose.Types.ObjectId(posted_by), 
        discipline, 
        files, 
        totalPrice, 
        price_per_page, 
        total_pages, 
        deadline, 
        title, 
        description,
        isPaid
    });
    await order.save();

    await notifyRole('writer', {
        type: 'new_order',
        title: 'New order available',
        message: title || `${discipline} order`,
        link: '/writer/orders',
        order: order._id.toString(),
    });

    return order;
}
