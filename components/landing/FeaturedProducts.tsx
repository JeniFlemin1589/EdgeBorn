"use client";

import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductSkeleton } from "@/components/products/ProductSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function FeaturedProducts() {
    const { products, isLoading, error } = useProducts();

    // Show the first 4 products for the featured section
    const featuredProducts = products.slice(0, 4);

    if (isLoading && products.length === 0) {
        return (
            <section className="py-24 md:py-32 bg-secondary/10">
                <div className="container px-4 md:px-6 mx-auto max-w-screen-2xl">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                        <div className="space-y-4 w-full max-w-2xl">
                            <div className="h-4 w-32 bg-secondary/30 rounded animate-pulse" />
                            <div className="h-12 w-64 bg-secondary/40 rounded animate-pulse" />
                            <div className="h-4 w-full bg-secondary/20 rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 lg:grid-cols-4 gap-2 md:gap-8">
                        <ProductSkeleton />
                        <ProductSkeleton />
                        <ProductSkeleton />
                        <ProductSkeleton />
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <div className="py-24 text-center">
                <p className="text-destructive font-medium">Unable to load collection at the moment.</p>
            </div>
        );
    }

    if (featuredProducts.length === 0) {
        return null;
    }

    return (
        <section className="py-24 md:py-32 bg-secondary/10 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="container px-4 md:px-6 mx-auto max-w-screen-2xl relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div className="space-y-4 max-w-2xl text-center">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm justify-center">
                            <Sparkles className="h-4 w-4" /> Trending Now
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                            BEST OF <span className="text-primary italic">EDGEBORN</span>
                        </h2>
                        <p className="text-muted-foreground text-lg italic">
                            A curated selection of our most loved pieces, handpicked for their exceptional craft.
                        </p>
                    </div>
                    <Link href="/products">
                        <Button variant="ghost" className="group text-lg hover:bg-transparent">
                            Browse All <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                        </Button>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-4 lg:grid-cols-4 gap-2 md:gap-8"
                >
                    {featuredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            image={product.image}
                            category={product.category}
                            sizes={product.sizes}
                            colors={product.colors}
                            inventory={product.inventory}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
