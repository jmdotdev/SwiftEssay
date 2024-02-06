import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "client", "writer"],
  },
  assigned_tasks: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: [] },
  ],
  posted_jobs: {
    type: Array,
    default: [],
  },
  paypal_account: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  is_assigned: {
    type: Boolean,
    default: false,
  },
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports(User);
