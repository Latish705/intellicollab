import mongoose, { Schema, model } from "mongoose";
interface IUser {
  name: string;
  isPremium: boolean;
  phone: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  isPremium: { type: Boolean, required: true, default: false },
  phone: { type: String, required: true },
});

const User = model("User");
export default User;
