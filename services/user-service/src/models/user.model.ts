import mongoose, { Schema, model } from "mongoose";
export interface IUser {
  isPremium: boolean;
  phone: string;
  email: string;
  firebaseId: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    isPremium: { type: Boolean, required: true, default: false },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firebaseId: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
