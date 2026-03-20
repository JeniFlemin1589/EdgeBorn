"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Truck, Clock, MapPin, Package, ShieldCheck, CheckCircle } from "lucide-react";

const shippingOptions = [
    {
        title: "Standard Shipping",
        time: "3 – 5 Business Days",
        price: "Rs. 250",
        description: "Available island-wide across Sri Lanka. Reliable and affordable.",
        icon: Truck,
    },
    {
        title: "Express Delivery",
        time: "1 – 2 Business Days",
        price: "Rs. 500",
        description: "Fast delivery for Colombo, Gampaha, and surrounding districts.",
        icon: Clock,
    },
    {
        title: "Free Shipping",
        time: "3 – 5 Business Days",
        price: "Free",
        description: "Automatically applied when you order 5 or more items.",
        icon: Package,
        highlight: true,
    },
];

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                {/* Hero */}
                <section className="relative bg-[#fdfaf5] py-16 md:py-24 overflow-hidden">
                    <div className="container px-4 md:px-8 max-w-screen-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center max-w-2xl mx-auto"
                        >
                            <span className="inline-block py-1 px-4 rounded-full bg-primary/10 text-primary font-bold text-xs tracking-widest uppercase mb-4">
                                Delivery Info
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.95]">
                                Shipping <span className="text-primary">&amp; Delivery</span>
                            </h1>
                            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                                We deliver across Sri Lanka with care and speed. Here&apos;s everything you need to know about our shipping options.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Shipping Options Cards */}
                <section className="py-16 md:py-24">
                    <div className="container px-4 md:px-8 max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-6 mb-16">
                            {shippingOptions.map((option, i) => {
                                const Icon = option.icon;
                                return (
                                    <motion.div
                                        key={option.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className={`p-6 rounded-3xl border ${option.highlight
                                            ? "border-primary/30 bg-primary/5 shadow-xl shadow-primary/10"
                                            : "border-border/40 bg-white"
                                            } text-center`}
                                    >
                                        <div className={`h-12 w-12 rounded-2xl ${option.highlight ? "bg-primary/10" : "bg-secondary/30"} flex items-center justify-center mx-auto mb-4`}>
                                            <Icon className={`h-6 w-6 ${option.highlight ? "text-primary" : "text-muted-foreground"}`} />
                                        </div>
                                        <h3 className="font-black text-lg uppercase tracking-tight">{option.title}</h3>
                                        <p className="text-2xl font-bold text-primary mt-2">{option.price}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{option.time}</p>
                                        <p className="text-xs text-muted-foreground/70 mt-3">{option.description}</p>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Shipping Details */}
                        <div className="space-y-8 max-w-2xl mx-auto">
                            <div className="flex items-start gap-4">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <MapPin className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm uppercase tracking-tight">Delivery Coverage</h3>
                                    <p className="text-sm text-muted-foreground mt-1">We currently deliver to all provinces in Sri Lanka. Remote areas may take an additional 1-2 business days.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm uppercase tracking-tight">Packaging</h3>
                                    <p className="text-sm text-muted-foreground mt-1">All orders are carefully packed in premium branded packaging to ensure your items arrive in perfect condition.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm uppercase tracking-tight">Order Confirmation</h3>
                                    <p className="text-sm text-muted-foreground mt-1">You&apos;ll receive a confirmation email with your order details as soon as your purchase is complete. A tracking update follows once the order is dispatched.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
