import mongoose from "mongoose";
import { User } from "../models/User";
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
    const writers = await User.find({ role: "writer" }).select("-password");
    return writers;
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
    await user.deleteOne();
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
}