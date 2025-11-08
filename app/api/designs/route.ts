// app/api/designs/route.ts
import { NextResponse } from "next/server";
import { mockDesigns } from "@/lib/mock-data";

export const GET = () => NextResponse.json(mockDesigns);