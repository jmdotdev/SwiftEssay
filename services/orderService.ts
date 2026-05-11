import { Order } from "@/models/Order";
import mongoose from "mongoose";

export async function createOrder(posted_by: string, discipline: string, files: { url: string; public_id: string }[], totalPrice: number, price_per_page: number, total_pages: number, deadline: Date, title?: string, description?: string) {
    const order = new Order({ 
        posted_by: new mongoose.Types.ObjectId(posted_by), 
        discipline, 
        files, 
        totalPrice, 
        price_per_page, 
        total_pages, 
        deadline, 
        title, 
        description 
    });
    await order.save();
    return order;
}
