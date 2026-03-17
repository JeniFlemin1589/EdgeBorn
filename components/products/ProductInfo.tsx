"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Minus, Plus, ShoppingCart, Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { useCart } from "@/context/CartContext";

import { Product } from "@/context/ProductContext";

interface ProductInfoProps {
    product: Product & {
        rating?: number;
        reviewCount?: number;
    };
}

export function ProductInfo({ product }: ProductInfoProps) {
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || "M");
    const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0]?.name || "Black");
    const [quantity, setQuantity] = useState(1);

    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    return (
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
                        <button className="text-sm text-primary underline hover:text-primary/80">Size Chart</button>
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

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                <div className="flex items-center border rounded-md w-[140px]">
                    <Button variant="ghost" size="icon" onClick={decrementQuantity} className="h-10 w-10 rounded-none rounded-l-md">
                        <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 text-center font-medium">{quantity}</div>
                    <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-10 w-10 rounded-none rounded-r-md">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <Button
                    className="flex-1 h-10"
                    size="lg"
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
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10">
                    <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Share2 className="h-4 w-4" />
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
    );
}
