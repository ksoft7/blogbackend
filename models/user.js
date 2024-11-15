import mongoose from "mongoose";

const userReg = new mongoose.Schema(
  {
    username: { type: String, required: true, lowercase: true, unique: true },

    email: { type: String, required: true, lowercase: true, unique: true },
    role: {
      type: String,
      required: true,
      lowercase: true,
      default: "regular-user",
    },
    password: {
      type: String,
      required: true,
      minLength: 10,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userReg);
