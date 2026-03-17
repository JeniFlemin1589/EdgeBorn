import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { CollectionsGrid } from "@/components/landing/CollectionsGrid";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { BrandValues } from "@/components/landing/BrandValues";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <CollectionsGrid />
        <FeaturedProducts />
        <BrandValues />
      </main>
      <Footer />
    </div>
  );
}
