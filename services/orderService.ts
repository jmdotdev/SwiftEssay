import { Order } from "@/models/Order";

export async function createOrder(posted_by: string, discipline: string, files: string[], totalPrice: number, price_per_page: number, total_pages: number, deadline: Date) {
    const order = new Order({ posted_by, discipline, files, totalPrice, price_per_page, total_pages, deadline });
    await order.save();
    return order;
}
