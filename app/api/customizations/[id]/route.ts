import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Customization from "@/models/customization";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();

  const item = await Customization.findById(id);
  return NextResponse.json(item);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = await request.json();

  await connectDB();
  const updated = await Customization.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();

  await Customization.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
}
