// app/api/products/route.ts
import { NextResponse } from "next/server";
import { mockProducts } from "@/lib/mock-data";

export const GET = () => NextResponse.json(mockProducts);