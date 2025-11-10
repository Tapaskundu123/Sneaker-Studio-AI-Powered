import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Customization from "@/models/customization";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const item = await Customization.findById(params.id);
  return NextResponse.json(item);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const data = await req.json();
  const updated = await Customization.findByIdAndUpdate(params.id, data, {
    new: true,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Customization.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true }, { status: 204 });
}
