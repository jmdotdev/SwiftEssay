import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'writer'], default: 'writer' },
  password: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", userSchema)