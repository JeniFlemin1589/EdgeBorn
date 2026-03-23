"use client";

import { useEffect, useState, use } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import { ProductReviews } from "@/components/products/ProductReviews";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useProducts, Product } from "@/context/ProductContext";
import { supabase } from "@/lib/supabase";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { products } = useProducts();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [avgRating, setAvgRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);

    const fetchReviewStats = async (productId: string) => {
        const { data } = await supabase
            .from("reviews")
            .select("rating")
            .eq("product_id", productId);

        if (data && data.length > 0) {
            const total = data.reduce((sum, r) => sum + r.rating, 0);
            setAvgRating(Math.round(total / data.length));
            setReviewCount(data.length);
        }
    };

    useEffect(() => {
        if (id && products.length > 0) {
            const found = products.find(p => p.id === id);
            setProduct(found || null);
            setIsLoading(false);
            if (found) fetchReviewStats(found.id);
        } else if (products.length > 0) {
            setIsLoading(false);
        }
    }, [id, products]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold">Product Not Found</h2>
                <Link href="/products"><Button>Back to Shop</Button></Link>
            </div>
        );
    }

    const productImages = product.image ? [product.image] : ["/placeholder-1.jpg"];

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container px-4 md:px-6 py-6 md:py-12 mx-auto max-w-screen-2xl">
                <div className="mb-6">
                    <Link href="/products">
                        <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent hover:text-primary">
                            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Products
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                    <div>
                        <ProductGallery images={productImages} />
                    </div>
                    <div>
                        <ProductInfo product={{ ...product, rating: avgRating, reviewCount }} />
                    </div>
                </div>

                <div className="mt-16 lg:mt-24 max-w-4xl">
                    <hr className="mb-12 border-border" />
                    <ProductReviews productId={product.id} onReviewChange={() => fetchReviewStats(product.id)} />
                </div>
            </main>
            <Footer />
        </div>
    );
}
