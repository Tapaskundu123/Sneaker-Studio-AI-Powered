// app/page.tsx (or wherever Home is)
import React from "react";
import Card from "../../components/Card";
import { HeroSection } from "@/components/HeroSection";
import TrendingPage from "@/components/TrendingPage";
import { connectDB } from "@/lib/dbConnect";
import { Product } from "@/models/product.model";

const Home = async () => {
  await connectDB();
  const products = await Product.find({}).lean();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section>
        <HeroSection />
      </section>

      <section aria-labelledby="latest" className="pb-12">
        <h2 id="latest" className="mb-6 text-heading-3 text-dark-900">
          Latest shoes
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
  <Card
    key={p._id}
    id={p.id} // ✅ Use _id here
    title={p.title}
    subtitle={p.subtitle}
    meta={p.meta}
    imageSrc={p.imageSrc}
    price={p.price}
    badge={p.badge}
  />
))}
        </div>
      </section>

      <section>
        <TrendingPage />
      </section>
    </main>
  );
};

export default Home;

