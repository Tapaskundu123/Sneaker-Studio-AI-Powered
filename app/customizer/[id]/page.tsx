// app/customizer/[id]/page.tsx
import AIShoeCustomizer from "@/components/ShoeCustomizer";
import { Product } from "@/models/product.model";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // ✅ Await params before using
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return <div className="p-8 text-red-600">Invalid product ID</div>;
  }

  try {
    // Query by custom `id` field
    const product = await Product.findOne({ id });

    // Or fallback to MongoDB _id
    // const product = await Product.findById(id);

    if (!product) {
      return <div className="p-8 text-gray-600">Product not found</div>;
    }

    return (
      <AIShoeCustomizer
        id={product.id?.toString() || product._id.toString()}
        cloudinaryUrl={product.imageSrc}
      />
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return <div className="p-8 text-red-600">Server error. Check logs.</div>;
  }
}