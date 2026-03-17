"use client";

import { cn } from "@/lib/utils";

export function ProductSkeleton() {
    return (
        <div className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm animate-pulse">
            {/* Image Placeholder */}
            <div className="aspect-[3/4] bg-secondary/20" />

            {/* Content Placeholder */}
            <div className="flex flex-col p-1.5 md:p-4 space-y-1 md:space-y-3">
                {/* Category */}
                <div className="h-1.5 md:h-3 w-1/4 bg-secondary/30 rounded" />

                {/* Title */}
                <div className="h-2.5 md:h-5 w-3/4 bg-secondary/40 rounded" />

                {/* Price */}
                <div className="mt-1 h-3 md:h-6 w-1/3 bg-secondary/50 rounded" />
            </div>
        </div>
    );
}

export function ProductSkeletonGrid({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
}
