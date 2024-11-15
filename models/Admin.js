import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    role: {
      type: String,
      required: true,
      lowercase: true,
      default: "admin",
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
