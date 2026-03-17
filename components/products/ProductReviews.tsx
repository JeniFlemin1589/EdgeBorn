"use client";

import { Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const REVIEWS = [
    {
        id: 1,
        author: "Alex M.",
        rating: 5,
        date: "2 months ago",
        title: "Absolutely love it!",
        content: "The quality of the cotton is amazing. Fits perfectly and feels very premium. Will definitely buy more colors.",
        helpful: 12
    },
    {
        id: 2,
        author: "Sarah J.",
        rating: 4,
        date: "1 month ago",
        title: "Great fit, fast shipping",
        content: "Arrived faster than expected. The medium fits me well (I'm 5'8\"). Slightly long, but I like the oversized look.",
        helpful: 5
    },
    {
        id: 3,
        author: "David K.",
        rating: 5,
        date: "3 weeks ago",
        title: "Best hoodie I own",
        content: "Super soft on the inside and nice thick material. Perfect for winter.",
        helpful: 8
    }
];

export function ProductReviews() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Customer Reviews</h3>
                <Button>Write a Review</Button>
            </div>

            <div className="space-y-6">
                {REVIEWS.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="flex text-yellow-500">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={cn("h-4 w-4", i < review.rating ? "fill-current" : "text-muted stroke-muted-foreground")} />
                                    ))}
                                </div>
                                <span className="font-semibold">{review.title}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">{review.content}</p>

                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-foreground">{review.author}</span>
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                                <ThumbsUp className="h-3 w-3" /> Helpful ({review.helpful})
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
