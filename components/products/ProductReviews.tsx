"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface Review {
    id: string;
    product_id: string;
    user_id: string;
    user_name: string;
    rating: number;
    title: string;
    content: string;
    created_at: string;
}

interface ProductReviewsProps {
    productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
    const { user, profile } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Review form state
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("reviews")
            .select("*")
            .eq("product_id", productId)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setReviews(data);
        }
        setLoading(false);
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSubmitting(true);
        const userName = profile?.first_name
            ? `${profile.first_name} ${(profile.last_name || "").charAt(0)}.`
            : user.email?.split("@")[0] || "Anonymous";

        const { error } = await supabase.from("reviews").insert({
            product_id: productId,
            user_id: user.id,
            user_name: userName,
            rating,
            title,
            content,
        });

        if (!error) {
            setTitle("");
            setContent("");
            setRating(5);
            setShowForm(false);
            fetchReviews();
        }
        setSubmitting(false);
    };

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const days = Math.floor(diff / 86400000);
        if (days < 1) return "Today";
        if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
        if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
        if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
        return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? "s" : ""} ago`;
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Customer Reviews</h3>
                {user ? (
                    <Button onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Cancel" : "Write a Review"}
                    </Button>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        <a href="/auth/login" className="text-primary underline">Sign in</a> to write a review
                    </p>
                )}
            </div>

            {/* Write Review Form */}
            {showForm && user && (
                <form onSubmit={handleSubmitReview} className="border rounded-2xl p-6 bg-secondary/10 space-y-4">
                    <div>
                        <label className="text-sm font-medium block mb-2">Your Rating</label>
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className="focus:outline-none"
                                    onClick={() => setRating(i + 1)}
                                    onMouseEnter={() => setHoverRating(i + 1)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    <Star
                                        className={cn(
                                            "h-6 w-6 transition-colors",
                                            i < (hoverRating || rating)
                                                ? "fill-yellow-500 text-yellow-500"
                                                : "text-muted-foreground"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-1">Title</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Great quality!"
                            required
                            className="rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-1">Your Review</label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Tell others about your experience..."
                            required
                            rows={4}
                            className="rounded-xl resize-none"
                        />
                    </div>
                    <Button type="submit" disabled={submitting} className="rounded-xl">
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Review
                    </Button>
                </form>
            )}

            {/* Reviews List */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map((review) => (
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
                                <span className="text-sm text-muted-foreground">{timeAgo(review.created_at)}</span>
                            </div>

                            <p className="text-sm text-muted-foreground mb-4">{review.content}</p>

                            <div className="flex items-center text-sm">
                                <span className="font-medium text-foreground">{review.user_name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border rounded-2xl border-dashed">
                    <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                </div>
            )}
        </div>
    );
}
