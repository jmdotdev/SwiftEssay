import mongoose from "mongoose"
import "./User"

const StatusEnum = ['unassigned', 'assigned', 'in_progress', 'revision', 'cancelled', 'completed'] as const;

const orderSchema = new mongoose.Schema({
    posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    discipline: { type: String, required: true },
    deadline: { type: Date, required: true },
    files: [{
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        name: { type: String, required: true }
    }],
    submitted_files: [{
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        name: { type: String, required: true }
    }],
    status: { type: String, enum: StatusEnum, default: 'unassigned' },
    totalPrice: { type: Number, required: true },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    price_per_page: { type: Number },   
    total_pages: { type: Number },
    isPaid: { type: Boolean, default: false },
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)