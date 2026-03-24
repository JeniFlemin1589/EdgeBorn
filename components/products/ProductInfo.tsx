"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Minus, Plus, ShoppingCart, Heart, Share2, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Product } from "@/context/ProductContext";

interface ProductInfoProps {
    product: Product & {
        rating?: number;
        reviewCount?: number;
    };
}

const SIZE_CHART = [
    { size: "S", chest: 18, length: 25 },
    { size: "M", chest: 19, length: 26 },
    { size: "L", chest: 20, length: 27 },
    { size: "XL", chest: 21, length: 28 },
    { size: "2XL", chest: 22, length: 29 },
    { size: "3XL", chest: 23, length: 30 },
    { size: "4XL", chest: 24, length: 30 },
    { size: "5XL", chest: 25, length: 32 },
    { size: "6XL", chest: 26, length: 33 },
];

export function ProductInfo({ product }: ProductInfoProps) {
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || "M");
    const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0]?.name || "Black");
    const [quantity, setQuantity] = useState(1);
    const [isFav, setIsFav] = useState(false);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const [shared, setShared] = useState(false);

    const incrementQuantity = () => {
        if (product.inventory && quantity < product.inventory) {
            setQuantity((prev) => prev + 1);
        }
    };
    const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const handleShare = async () => {
        const url = window.location.href;
        const text = `Check out ${product.name} on EdgeBorn!`;

        if (navigator.share) {
            try {
                await navigator.share({ title: product.name, text, url });
            } catch {
                // User cancelled share
            }
        } else {
            await navigator.clipboard.writeText(url);
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
                    <div className="mt-2 flex items-center gap-4">
                        <p className="text-2xl font-bold text-primary">Rs. {product.price.toFixed(2)}</p>
                        <div className="flex items-center text-sm text-yellow-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={cn("h-4 w-4", i < Math.floor(product.rating || 0) ? "fill-current" : "text-muted stroke-muted-foreground")} />
                            ))}
                            <span className="ml-2 text-muted-foreground">({product.reviewCount || 0} reviews)</span>
                        </div>
                    </div>
                </div>

                <div className="prose prose-sm text-muted-foreground">
                    <p>{product.description}</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <span className="text-sm font-medium">Color: <span className="text-muted-foreground">{selectedColor}</span></span>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {product.colors.map((color) => (
                                <button
                                    key={color.name}
                                    onClick={() => setSelectedColor(color.name)}
                                    className={cn(
                                        "h-8 w-8 rounded-full border-2 ring-offset-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring",
                                        selectedColor === color.name ? "border-primary ring-2" : "border-transparent hover:ring-2"
                                    )}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                >
                                    <span className="sr-only">{color.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Size: <span className="text-muted-foreground">{selectedSize}</span></span>
                            <button
                                className="text-sm text-primary underline hover:text-primary/80"
                                onClick={() => setShowSizeChart(true)}
                            >
                                Size Chart
                            </button>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={cn(
                                        "flex h-10 items-center justify-center rounded-md border text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                        selectedSize === size ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input"
                                    )}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Add to Cart — compact on mobile */}
                <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="flex items-center border rounded-md">
                        <Button variant="ghost" size="icon" onClick={decrementQuantity} className="h-10 w-10 rounded-none rounded-l-md">
                            <Minus className="h-4 w-4" />
                        </Button>
                        <div className="w-10 text-center font-medium">{quantity}</div>
                        <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-10 w-10 rounded-none rounded-r-md">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-col flex-1 gap-1">
                        <Button
                            className="h-10 rounded-xl font-bold uppercase tracking-wide text-sm w-full"
                            disabled={!product.inventory || product.inventory === 0}
                            onClick={() => addItem({
                                productId: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image || "/placeholder-1.jpg",
                                size: selectedSize,
                                color: selectedColor,
                                quantity: quantity
                            })}
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" /> 
                            {!product.inventory || product.inventory === 0 ? "Out of Stock" : "Add to Cart"}
                        </Button>
                        {product.inventory > 0 && product.inventory <= 5 && (
                            <span className="text-xs text-destructive font-medium text-center">Only {product.inventory} left in stock!</span>
                        )}
                        {(!product.inventory || product.inventory === 0) && (
                            <span className="text-xs text-destructive font-medium text-center">Currently out of stock.</span>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className={cn("h-10 w-10 rounded-xl transition-all", isFav && "bg-red-50 border-red-200")}
                        onClick={() => setIsFav(!isFav)}
                    >
                        <Heart className={cn("h-4 w-4 transition-all", isFav ? "fill-red-500 text-red-500" : "")} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-10 w-10 rounded-xl", shared && "text-green-600")}
                        onClick={handleShare}
                        title="Share this product"
                    >
                        {shared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">🚚</div>
                        <div>
                            <p className="font-medium">Free Shipping</p>
                            <p className="text-muted-foreground text-xs">On orders of 5 items or more</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">↩️</div>
                        <div>
                            <p className="font-medium">Free Returns</p>
                            <p className="text-muted-foreground text-xs">Within 30 days</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Size Chart Modal */}
            {showSizeChart && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowSizeChart(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors"
                            onClick={() => setShowSizeChart(false)}
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <h3 className="text-xl font-black tracking-tighter uppercase italic mb-1">Size Chart</h3>
                        <p className="text-xs text-muted-foreground mb-4">All measurements are in inches</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-primary/10">
                                        <th className="py-2 px-3 text-left font-bold text-primary border border-primary/20">Size</th>
                                        {SIZE_CHART.map((row) => (
                                            <th key={row.size} className="py-2 px-3 text-center font-bold border border-primary/20">{row.size}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-amber-50">
                                        <td className="py-2 px-3 font-bold text-red-600 border border-primary/20">Chest</td>
                                        {SIZE_CHART.map((row) => (
                                            <td key={row.size} className="py-2 px-3 text-center border border-primary/20">{row.chest}</td>
                                        ))}
                                    </tr>
                                    <tr className="bg-green-50">
                                        <td className="py-2 px-3 font-bold text-red-600 border border-primary/20">Length</td>
                                        {SIZE_CHART.map((row) => (
                                            <td key={row.size} className="py-2 px-3 text-center border border-primary/20">{row.length}</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
