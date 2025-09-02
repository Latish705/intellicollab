import mongoose, { Schema, model } from "mongoose";
interface IUser {
  name: string;
  isPremium: boolean;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    isPremium: { type: Boolean, required: true, default: false },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
