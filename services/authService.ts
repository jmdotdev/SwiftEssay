import { User } from "../models/User";
import bycrypt from "bcryptjs";

export async function registerUser( username: string, email: string, password: string) {
    const exists = await User.findOne({ email });
    if (exists) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bycrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role: "writer", status: "active" });
    await user.save();
    const payload = user.toObject();
    delete payload.password;
    return payload;
}

export async function loginUser(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const isMatch = await bycrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }
    return user;
}
