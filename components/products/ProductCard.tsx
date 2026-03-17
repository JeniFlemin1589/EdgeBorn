"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    isNew?: boolean;
    isSale?: boolean;
    priority?: boolean;
}

export function ProductCard({ id, name, price, image, category, isNew, isSale, priority }: ProductCardProps) {
    const { addItem } = useCart();
    const { toggleFavorite, isFavorite } = useWishlist();
    const favorite = isFavorite(id);
    return (
        <motion.div
            className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary/20">
                {isNew && (
                    <Badge className="absolute left-2 top-2 z-10" variant="default">
                        New
                    </Badge>
                )}
                {isSale && (
                    <Badge className="absolute left-2 top-2 z-10 bg-destructive text-destructive-foreground" variant="destructive">
                        Sale
                    </Badge>
                )}

                <Link href={`/products/${id}`}>
                    <div className="h-full w-full bg-secondary/5 group-hover:scale-105 transition-transform duration-500 relative">
                        <span className="sr-only">{name}</span>
                        {image ? (
                            <Image
                                src={image}
                                alt={name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={priority}
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-4xl font-bold opacity-20">TSHIRT</div>
                        )}
                    </div>
                </Link>

                {/* Quick Actions Overlay - Visible on Hover (Desktop) and always show heart if favorite (Mobile) */}
                <div className={cn(
                    "absolute bottom-0 left-0 right-0 p-2 md:p-4 transition-all duration-300 flex justify-center gap-2",
                    "bg-gradient-to-t from-black/60 to-transparent",
                    "translate-y-full group-hover:translate-y-0",
                    favorite && "translate-y-0" // Always show if it's a favorite
                )}>
                    <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full h-8 w-8 md:h-10 md:w-10 hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={(e) => {
                            e.preventDefault();
                            addItem({
                                productId: id,
                                name: name,
                                price: price,
                                image: image,
                                size: "M", // Default
                                color: "Default", // Default
                                quantity: 1
                            });
                        }}
                    >
                        <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="sr-only">Add to Cart</span>
                    </Button>
                    <Button
                        size="icon"
                        variant="secondary"
                        className={cn(
                            "rounded-full h-8 w-8 md:h-10 md:w-10 transition-colors",
                            favorite ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "hover:bg-destructive hover:text-white"
                        )}
                        onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(id);
                        }}
                    >
                        <Heart className={cn("h-3 w-3 md:h-4 md:w-4", favorite && "fill-current")} />
                        <span className="sr-only">Wishlist</span>
                    </Button>
                </div>
            </div>

            <div className="flex flex-col p-1.5 md:p-4">
                <span className="text-[7px] md:text-xs text-muted-foreground uppercase tracking-wider">{category}</span>
                <Link href={`/products/${id}`} className="mt-0.5 md:mt-1 font-medium hover:underline line-clamp-1 text-[9px] md:text-base leading-tight">
                    {name}
                </Link>
                <div className="mt-0.5 md:mt-2 flex items-center justify-between">
                    <span className="font-bold text-[10px] md:text-lg">Rs. {price.toFixed(0)}</span>
                </div>
            </div>
        </motion.div>
    );
}
