import mongoose from "mongoose";
import { User } from "../models/User";
import { Order } from "@/models/Order";
import { connectDB } from "@/lib/mongoose";
import bycrypt from "bcryptjs";
import { signToken } from '@/lib/jwt'
import { sendMail } from '@/lib/mailer'

export async function addWriter( username: string, email: string, status: string) {
    const exists = await User.findOne({ email });
    if (exists) {
        throw new Error("User already exists");
    }
    const dummyPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bycrypt.hash(dummyPassword, 10);
    const user = new User({ username, email, password: hashedPassword, role: "writer", status: status });
    await user.save();
    // generate a reset token so the invited writer can set their password
    try {
        const token = signToken({ userId: user._id, type: 'reset' })
        const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const link = `${base}/reset-password?token=${token}`
        const html = `
          <p>Hello ${username || 'Writer'},</p>
          <p>You were added as a writer. Click the link below to set your password and sign in:</p>
          <p><a href="${link}">Set your password</a></p>
          <p>This link will expire in 24 hours.</p>
        `
        await sendMail({ to: email, subject: 'Set your SwiftEssay password', html })
    } catch (err) {
        // don't block creation if email sending fails; log to console
        console.error('Failed to send invite email', err)
    }
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
}

export async function getWriters() {
    await connectDB();

    const writers = await User.find({ role: "writer" }).select("-password").lean();

    // Aggregate order counts per writer for different statuses
    const stats = await Order.aggregate([
        {
            $match: {
                assigned_to: { $exists: true, $ne: null },
            },
        },
        {
            $group: {
                _id: "$assigned_to",
                completed: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
                    },
                },
                pending: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
                    },
                },
                inRevision: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "revision"] }, 1, 0],
                    },
                },
                cancelled: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
                    },
                },
                activeCount: {
                    $sum: {
                        $cond: [{ $in: ["$status", ["assigned", "in_progress"]] }, 1, 0],
                    },
                },
            },
        },
    ]);

    const statsMap = new Map<string, any>(stats.map((s) => [s._id.toString(), s]));

    return writers.map((writer) => {
        const s = statsMap.get(writer._id.toString()) || {};
        return {
            ...writer,
            tasksCompleted: s.completed ?? 0,
            pendingTasks: s.pending ?? 0,
            inRevision: s.inRevision ?? 0,
            canceledTasks: s.cancelled ?? 0,
            activeOrderCount: s.activeCount ?? 0,
            hasActiveOrder: (s.activeCount ?? 0) > 0,
        }
    });
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