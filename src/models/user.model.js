import mongoose from "mongoose";
import validator from "validator";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter the UserName"],
      minLength: [4, "Name atleast 4 characters"],
      maxLength: [30, "Name should not exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Enter the Email"],
      unique: true,
      validate: [validator.isEmail, "Enter the valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password atleast 8 characters"],
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
