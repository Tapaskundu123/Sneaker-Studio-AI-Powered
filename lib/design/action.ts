// lib/design/actions.ts
"use server";

import { z } from "zod";
import { mockProducts, mockDesigns } from "../mock-data";
import { revalidatePath } from "next/cache";
import type { Product, SavedDesign } from "../types";

/* ---------- Get all products (mock API) ---------- */
export async function getProducts(): Promise<Product[]> {
  return mockProducts;
}

/* ---------- Save a design ---------- */
const saveSchema = z.object({
  productId: z.string(),
  customizations: z.record(z.any()),
  tags: z.array(z.string()).optional(),
});

export async function saveDesign(formData: FormData) {
  const productId = formData.get("productId") as string;
  const customizations = JSON.parse(
    formData.get("customizations") as string
  );
  const tags = formData.get("tags")
    ? (formData.get("tags") as string).split(",").map((t) => t.trim())
    : [];

  const parsed = saveSchema.safeParse({ productId, customizations, tags });
  if (!parsed.success) return { error: "Bad payload" };

  const newDesign: SavedDesign = {
    id: crypto.randomUUID(),
    userId: "uuid-user", // <-- replace with real session userId
    productId: parsed.data.productId,
    customizations: parsed.data.customizations,
    previewImage: "/images/preview-generated.png", // canvas later
    tags: parsed.data.tags,
    created_at: new Date().toISOString(),
  };

  mockDesigns.push(newDesign);
  revalidatePath("/designs");
  return { success: true, designId: newDesign.id };
}

/* ---------- Get user designs ---------- */
export async function getDesigns(userId: string): Promise<SavedDesign[]> {
  return mockDesigns.filter((d) => d.userId === userId);
}

/* ---------- Delete design ---------- */
export async function deleteDesign(designId: string) {
  const idx = mockDesigns.findIndex((d) => d.id === designId);
  if (idx === -1) return { error: "Not found" };
  mockDesigns.splice(idx, 1);
  revalidatePath("/designs");
  return { success: true };
}