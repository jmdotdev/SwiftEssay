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