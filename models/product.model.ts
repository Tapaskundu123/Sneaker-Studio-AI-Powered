// models/Product.ts
import { Schema, model, models } from "mongoose";

export interface IProduct {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  price?: number;
  imageSrc: string;
  badge?: {
    label: string;
    tone?: "red" | "green" | "orange";
  };
}

const productSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: String,
    meta: String,
    price: Number,
    imageSrc: { type: String, required: true },
    badge: {
      label: String,
      tone: { type: String, enum: ["red", "green", "orange"] },
    },
  },
  { timestamps: true }
);

export const Product = models.Product || model<IProduct>("Product", productSchema);