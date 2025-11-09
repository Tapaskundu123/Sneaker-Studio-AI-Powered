// models/User.ts
import { Schema, model, models } from "mongoose";

export interface IUser {
  name?: string;
  email: string;
  password: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  createdAt: { type: Date, default: Date.now },
});

export const User = models.User || model<IUser>("User", userSchema);