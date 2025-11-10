import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import { Product } from "@/models/product.model";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();

  const product = await Product.findById(id);
  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = await request.json();

  await connectDB();
  const updated = await Product.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();

  await Product.findByIdAndDelete(id);
  return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
}
