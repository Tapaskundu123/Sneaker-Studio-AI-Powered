// lib/mock-data.ts
import type { Product, SavedDesign} from "./types";

export const mockProducts: Product[] = [
  {
    id: "uuid-1",
    name: "Air Max 90",
    baseImage: "/shoes/shoe-1.jpg",
    customizableParts: ["sole", "upper", "laces"],
    options: {
      colors: ["#FF0000", "#0000FF", "#000000", "#FFFFFF", "#FFD700", "#00FF00"],
      materials: ["leather", "canvas", "mesh"],
    },
  },
  {
    id: "uuid-2",
    name: "Air Jordan 1",
    baseImage: "/shoes/shoe-2.webp",
    customizableParts: ["sole", "upper", "laces", "swoosh"],
    options: {
      colors: ["#C8102E", "#000000", "#FFFFFF", "#FFD700", "#003087"],
      materials: ["leather", "suede", "patent"],
    },
  },
  {
    id: "uuid-3",
    name: "Dunk Low",
    baseImage: "/shoes/shoe-3.webp",
    customizableParts: ["sole", "upper", "laces"],
    options: {
      colors: ["#FF69B4", "#32CD32", "#1E90FF", "#FFA500", "#4B0082"],
      materials: ["canvas", "leather", "nubuck"],
    },
  },
  {
    id: "uuid-4",
    name: "Blazer Mid",
    baseImage:  "/shoes/shoe-4.webp",
    customizableParts: ["sole", "upper", "laces"],
    options: {
      colors: ["#228B22", "#8B0000", "#4682B4", "#DAA520", "#708090"],
      materials: ["leather", "suede", "canvas"],
    },
  },
];

export const mockDesigns: SavedDesign[] = [
  {
    id: "uuid-1",
    userId: "uuid-user",
    productId: "uuid-1",
    customizations: {
      upper: { color: "#FF0000", material: "leather" },
      sole: { color: "#FFFFFF" },
      laces: { color: "#000000" },
      text: "Just Do It",
    },
    previewImage: "/shoes/shoe-5.avif",
    tags: ["summer", "red", "sport"],
    created_at: "2025-10-10T10:00:00Z",
  },
  {
    id: "uuid-2",
    userId: "uuid-user",
    productId: "uuid-2",
    customizations: {
      upper: { color: "#C8102E", material: "leather" },
      swoosh: { color: "#FFFFFF" },
      text: "MJ23",
    },
    previewImage: "/shoes/shoe-6.avif",
    tags: ["jordan", "basketball", "iconic"],
    created_at: "2025-10-11T14:30:00Z",
  },
  {
    id: "uuid-3",
    userId: "uuid-user",
    productId: "uuid-3",
    customizations: {
      upper: { color: "#32CD32", material: "canvas" },
      text: "Skate Life",
    },
    previewImage:"/shoes/shoe-7.avif",
    tags: ["green", "skate", "casual"],
    created_at: "2025-10-12T09:15:00Z",
  },
  {
    id: "uuid-4",
    userId: "uuid-user",
    productId: "uuid-1",
    customizations: {
      upper: { color: "#0000FF", material: "mesh" },
      text: "Run Free",
    },
    previewImage: "/shoes/shoe-8.avif",
    tags: ["blue", "running", "lightweight"],
    created_at: "2025-10-13T18:45:00Z",
  },
  {
    id: "uuid-5",
    userId: "uuid-user",
    productId: "uuid-4",
    customizations: {
      upper: { color: "#DAA520", material: "suede" },
      text: "Vintage",
    },
    previewImage: "/shoes/shoe-9.avif",
    tags: ["gold", "retro", "classic"],
    created_at: "2025-10-14T11:20:00Z",
  },
];

export const mockUsers: Array<{
  id: string;
  name?: string;
  email: string;
  password: string;
}> = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
];