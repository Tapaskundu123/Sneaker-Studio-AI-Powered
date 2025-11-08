// lib/types.ts
export interface Product {
  id: string;                     // UUID
  name: string;                   // e.g. "Air Max 90"
  baseImage: string;              // "/images/airmax-base.png"
  customizableParts: string[];    // ["sole","upper","laces"]
  options: {
    colors: string[];             // ["red","blue","black"]
    materials: string[];          // ["leather","canvas"]
  };
}

export interface SavedDesign {
  id: string;                     // UUID
  userId: string;                 // from auth
  productId: string;              // references Product.id
  customizations: Record<string, any>; // { upper:{color:"red",material:"leather"}, text:"My Custom Kick" }
  previewImage: string;           // "/images/preview-....png"
  tags: string[];                 // ["summer","custom"]
  created_at: string;             // ISO string
}

export interface User {
  id: string;                     // UUID
  email: string;
  password: string;               // **hashed** in production
}

/* ---------- Helper types for forms ---------- */
export type SignInForm = { email: string; password: string };
export type SignUpForm = { name: string; email: string; password: string };