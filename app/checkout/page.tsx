"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
    const { items } = useCart();
    const router = useRouter();

    useEffect(() => {
        // Redirect to cart if empty
        if (items.length === 0) {
            router.push("/cart");
        }
    }, [items, router]);

    if (items.length === 0) {
        return null; // Or loading spinner
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container px-4 md:px-6 py-6 md:py-12 mx-auto max-w-screen-2xl bg-secondary/5">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold tracking-tight mb-8 text-center">Checkout</h1>
                    <CheckoutForm />
                </div>
            </main>
            <Footer />
        </div>
    );
}
