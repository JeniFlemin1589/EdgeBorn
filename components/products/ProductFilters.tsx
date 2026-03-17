"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

export function ProductFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get current filters from URL
    const currentCategory = searchParams.get("category")?.toLowerCase() || "";
    const currentMinPrice = parseInt(searchParams.get("minPrice") || "0");
    const currentMaxPrice = parseInt(searchParams.get("maxPrice") || "10000");
    const currentSize = searchParams.get("size") || "";
    const currentColor = searchParams.get("color") || "";
    const showFavorites = searchParams.get("favorites") === "true";

    const [priceRange, setPriceRange] = useState([currentMinPrice, currentMaxPrice]);

    // Update URL helper
    const updateFilters = useCallback((key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/products?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    const handleReset = () => {
        setPriceRange([0, 10000]);
        router.push("/products");
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold uppercase tracking-tight italic text-primary">Filters</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-8 px-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
                >
                    <RotateCcw className="mr-2 h-3 w-3" /> Reset
                </Button>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between group cursor-pointer" onClick={() => updateFilters("favorites", showFavorites ? null : "true")}>
                    <Label
                        htmlFor="favorites-toggle"
                        className="text-sm font-bold uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors flex items-center gap-2"
                    >
                        Show Favorites Only
                    </Label>
                    <Checkbox
                        id="favorites-toggle"
                        checked={showFavorites}
                        onCheckedChange={() => { }}
                        className="border-2 rounded-md h-5 w-5"
                    />
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-black uppercase tracking-widest opacity-50">Categories</h4>
                <div className="space-y-3">
                    {["Men", "Women", "Unisex", "Accessories"].map((category) => (
                        <div key={category} className="flex items-center space-x-3 group cursor-pointer" onClick={() => updateFilters("category", currentCategory === category.toLowerCase() ? null : category.toLowerCase())}>
                            <Checkbox
                                id={`cat-${category}`}
                                checked={currentCategory === category.toLowerCase()}
                                onCheckedChange={() => { }} // Controlled via onClick on div for better hit area
                                className="border-2 rounded-md"
                            />
                            <Label
                                htmlFor={`cat-${category}`}
                                className="text-sm font-bold uppercase tracking-tight cursor-pointer group-hover:text-primary transition-colors"
                            >
                                {category}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-black uppercase tracking-widest opacity-50">Price Range</h4>
                <div className="px-2">
                    <div className="flex items-center justify-between text-sm font-bold tracking-tighter mb-4">
                        <span>Rs. {priceRange[0]}</span>
                        <span>Rs. {priceRange[1]}</span>
                    </div>
                    <Slider
                        defaultValue={[0, 10000]}
                        max={10000}
                        step={100}
                        value={priceRange}
                        onValueChange={(val) => setPriceRange(val)}
                        onValueCommit={(val) => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.set("minPrice", val[0].toString());
                            params.set("maxPrice", val[1].toString());
                            router.push(`/products?${params.toString()}`, { scroll: false });
                        }}
                        minStepsBetweenThumbs={1}
                        className="mt-2"
                    />
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-black uppercase tracking-widest opacity-50">Sizes</h4>
                <div className="grid grid-cols-4 gap-2">
                    {["XS", "S", "M", "L", "XL", "2XL"].map((size) => (
                        <div key={size} className="flex items-center justify-center">
                            <input
                                type="checkbox"
                                id={`size-${size}`}
                                className="peer sr-only"
                                checked={currentSize === size}
                                onChange={() => updateFilters("size", currentSize === size ? null : size)}
                            />
                            <label
                                htmlFor={`size-${size}`}
                                className="flex h-10 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-secondary bg-background hover:border-primary hover:text-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-all text-sm font-bold italic tracking-tighter"
                            >
                                {size}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-black uppercase tracking-widest opacity-50">Colors</h4>
                <div className="flex flex-wrap gap-3">
                    {[
                        { name: "White", class: "bg-white border-2 border-slate-200" },
                        { name: "Black", class: "bg-black" },
                        { name: "Navy", class: "bg-blue-900" },
                        { name: "Beige", class: "bg-[#f5f5dc] border-2 border-slate-200" },
                        { name: "Red", class: "bg-red-600" },
                    ].map((color) => (
                        <button
                            key={color.name}
                            onClick={() => updateFilters("color", currentColor === color.name.toLowerCase() ? null : color.name.toLowerCase())}
                            className={cn(
                                "relative h-10 w-10 rounded-full overflow-hidden transition-all ring-offset-2 hover:ring-2 ring-primary",
                                currentColor === color.name.toLowerCase() && "ring-2"
                            )}
                        >
                            <div className={cn("w-full h-full", color.class)} title={color.name} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
