import mongoose from "mongoose"

const StatusEnum = ['unassigned', 'assigned', 'in_progress', 'revision', 'cancelled', 'completed'] as const;

const orderSchema = new mongoose.Schema({
    posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    discipline: { type: String, required: true },
    files: [{ type: String, required: true }],
    status: { type: String, enum: StatusEnum, default: 'unassigned' },
    totalPrice: { type: Number, required: true },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)