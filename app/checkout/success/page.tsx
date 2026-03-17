"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container px-4 md:px-6 py-12 md:py-24 mx-auto max-w-screen-2xl flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center max-w-lg space-y-6"
                >
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                        <CheckCircle2 className="h-12 w-12" />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight">Order Placed Successfully!</h1>
                    <p className="text-muted-foreground text-lg">
                        Thank you for your purchase. We have received your order and will begin processing it right away.
                    </p>

                    <div className="bg-secondary/20 p-6 rounded-lg w-full text-left space-y-2">
                        <p className="text-sm font-semibold">Order Number: <span className="font-normal font-mono">#EB-{Math.floor(100000 + Math.random() * 900000)}</span></p>
                        <p className="text-sm font-semibold">Estimated Delivery: <span className="font-normal">3-5 Business Days</span></p>
                        <p className="text-sm text-muted-foreground mt-2">A confirmation email has been sent to your inbox.</p>
                    </div>

                    <div className="pt-6">
                        <Link href="/products">
                            <Button size="lg" className="w-full sm:w-auto">
                                Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
