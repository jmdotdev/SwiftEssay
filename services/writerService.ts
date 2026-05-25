import mongoose from "mongoose";
import { User } from "../models/User";
import { Order } from "@/models/Order";
import { connectDB } from "@/lib/mongoose";
import bycrypt from "bcryptjs";

export async function addWriter( username: string, email: string, status: string) {
    const exists = await User.findOne({ email });
    if (exists) {
        throw new Error("User already exists");
    }
    const dummyPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bycrypt.hash(dummyPassword, 10);
    const user = new User({ username, email, password: hashedPassword, role: "writer", status: status });
    await user.save();
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
}

export async function getWriters() {
    await connectDB();

    const writers = await User.find({ role: "writer" }).select("-password").lean();
    const activeAssignments = await Order.aggregate([
        {
            $match: {
                status: { $in: ["assigned", "in_progress"] },
                assigned_to: { $exists: true, $ne: null },
            },
        },
        {
            $group: {
                _id: "$assigned_to",
                count: { $sum: 1 },
            },
        },
    ]);
    const activeMap = new Map<string, number>(
        activeAssignments.map((group) => [group._id.toString(), group.count])
    );

    return writers.map((writer) => ({
        ...writer,
        activeOrderCount: activeMap.get(writer._id.toString()) ?? 0,
        hasActiveOrder: (activeMap.get(writer._id.toString()) ?? 0) > 0,
    }));
}

export async function updateWriter(id: string, username: string, email: string, status: string) {
    const user = await User.findById(id);
    if (!user) {
        throw new Error("User not found");
    }
    user.username = username || user.username;
    user.email = email || user.email;
    user.status = status || user.status;
    await user.save();
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
}


export async function deleteWriter (id: string) {
    const user = await User.findById(id);
    if (!user) {
        throw new Error("User not found");
    }

    // check if writer has any assigned orders in active states
    const assignedOrder = await Order.findOne({ assigned_to: user._id, status: { $in: ['assigned', 'in_progress'] } });
    if (assignedOrder) {
        throw new Error('Writer cannot be deleted because they are assigned to an active order');
    }

    await user.deleteOne();
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
}

export async function getWriterById(id: string) {
    await connectDB();
    const user = await User.findById(id).select('-password').lean();
    if (!user) {
        throw new Error('Writer not found');
    }

    // compute simple metrics for the writer
    const completedCount = await Order.countDocuments({ assigned_to: user._id, status: 'completed' });
    const pendingCount = await Order.countDocuments({ assigned_to: user._id, status: 'pending' });
    const inRevisionCount = await Order.countDocuments({ assigned_to: user._id, status: 'revision' });
    const activeOrder = await Order.findOne({ assigned_to: user._id, status: { $in: ['assigned', 'in_progress'] } }).lean();

    return {
        _id: user._id,
        username: user.username,
        name: (user.username as string) || '',
        email: user.email,
        status: user.status,
        createdAt: user.createdAt,
        tasksCompleted: completedCount,
        pendingTasks: pendingCount,
        inRevision: inRevisionCount,
        currentActiveTask: activeOrder ? (activeOrder.title || null) : null,
    };
}