"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useProducts } from "@/context/ProductContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSearchParams } from "next/navigation";
import { ProductSkeletonGrid } from "@/components/products/ProductSkeleton";

function ProductList() {
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">("newest");
    const [visibleCount, setVisibleCount] = useState(12);
    const { products, isLoading } = useProducts();
    const searchParams = useSearchParams();

    // Filter State
    const categoryFilter = searchParams.get("category");
    const searchFilter = searchParams.get("search");
    const minPrice = parseInt(searchParams.get("minPrice") || "0");
    const maxPrice = parseInt(searchParams.get("maxPrice") || "10000");
    const sizeFilter = searchParams.get("size");
    const colorFilter = searchParams.get("color");
    const favoritesOnly = searchParams.get("favorites") === "true";
    const { isFavorite, wishlist } = useWishlist();

    const filteredAndSortedProducts = useMemo(() => {
        const filtered = products.filter(product => {
            // Favorites Filter
            if (favoritesOnly && !isFavorite(product.id)) {
                return false;
            }
            // Category Filter
            if (categoryFilter && product.category.toLowerCase() !== categoryFilter.toLowerCase()) {
                return false;
            }
            // Search / Theme Filter
            if (searchFilter) {
                const searchLower = searchFilter.toLowerCase();
                const matchesSearch =
                    product.name.toLowerCase().includes(searchLower) ||
                    product.theme.toLowerCase().includes(searchLower) ||
                    product.category.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }
            // Price Filter
            if (product.price < minPrice || product.price > maxPrice) {
                return false;
            }
            // Size Filter
            if (sizeFilter) {
                const hasSize = product.sizes?.some(s => s.toLowerCase() === sizeFilter.toLowerCase());
                if (!hasSize) return false;
            }
            // Color Filter
            if (colorFilter) {
                const hasColor = product.colors?.some(c => c.name.toLowerCase() === colorFilter.toLowerCase());
                if (!hasColor) return false;
            }
            return true;
        });

        // Apply Sorting
        return [...filtered].sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // newest
        });
    }, [products, categoryFilter, searchFilter, minPrice, maxPrice, sizeFilter, colorFilter, sortBy, favoritesOnly, wishlist]);

    // Reset visible count when filters change
    useEffect(() => {
        setVisibleCount(12);
    }, [categoryFilter, searchFilter, minPrice, maxPrice, sizeFilter, colorFilter, sortBy, favoritesOnly]);

    const visibleProducts = filteredAndSortedProducts.slice(0, visibleCount);
    const hasMore = visibleCount < filteredAndSortedProducts.length;

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container px-4 md:px-6 py-6 md:py-12 mx-auto max-w-screen-2xl">
                {/* Breadcrumb / Title area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {categoryFilter ? `${categoryFilter} Collection` : "All Products"}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm md:text-base">
                            Showing {visibleProducts.length} of {filteredAndSortedProducts.length} results
                            {searchFilter && ` for "${searchFilter}"`}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        {/* Mobile Filter Trigger */}
                        <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="md:hidden flex-1">
                                    <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>Filters</SheetTitle>
                                </SheetHeader>
                                <div className="py-4">
                                    <ProductFilters />
                                </div>
                            </SheetContent>
                        </Sheet>

                        <Sheet open={isSortOpen} onOpenChange={setIsSortOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="flex-1 md:flex-none">
                                    <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[300px] rounded-t-3xl sm:max-w-none">
                                <SheetHeader className="text-left border-b pb-4">
                                    <SheetTitle>Sort By</SheetTitle>
                                </SheetHeader>
                                <div className="grid gap-4 py-6">
                                    <Button 
                                        variant={sortBy === "newest" ? "default" : "ghost"} 
                                        className="justify-start font-bold uppercase tracking-widest h-12 rounded-xl"
                                        onClick={() => { setSortBy("newest"); setIsSortOpen(false); }}
                                    >
                                        Newest First
                                    </Button>
                                    <Button 
                                        variant={sortBy === "price-low" ? "default" : "ghost"} 
                                        className="justify-start font-bold uppercase tracking-widest h-12 rounded-xl"
                                        onClick={() => { setSortBy("price-low"); setIsSortOpen(false); }}
                                    >
                                        Price: Low to High
                                    </Button>
                                    <Button 
                                        variant={sortBy === "price-high" ? "default" : "ghost"} 
                                        className="justify-start font-bold uppercase tracking-widest h-12 rounded-xl"
                                        onClick={() => { setSortBy("price-high"); setIsSortOpen(false); }}
                                    >
                                        Price: High to Low
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Desktop Filters Sidebar */}
                    <aside className="hidden md:block w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <ProductFilters />
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {isLoading && products.length === 0 ? (
                            <ProductSkeletonGrid count={8} />
                        ) : visibleProducts.length > 0 ? (
                            <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
                                {visibleProducts.map((product, index) => (
                                    <ProductCard
                                        key={product.id}
                                        {...product}
                                        isNew={new Date(product.created_at) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)}
                                        priority={index < 4}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <p className="text-xl text-muted-foreground">No products found holding that criteria.</p>
                                <Button variant="outline" onClick={() => window.location.href = '/products'}>Clear Filters</Button>
                            </div>
                        )}

                        {/* Load More */}
                        {hasMore && (
                            <div className="mt-12 flex justify-center">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-xl px-12 font-bold uppercase tracking-widest"
                                    onClick={() => setVisibleCount(prev => prev + 12)}
                                >
                                    Load More
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div>Loading products...</div>}>
            <ProductList />
        </Suspense>
    );
}
