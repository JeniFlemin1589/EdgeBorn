"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, RefreshCw, Zap } from "lucide-react";

const VALUES = [
    {
        icon: <Truck className="h-8 w-8" />,
        title: "Fast Global Shipping",
        description: "Priority delivery to over 50 countries worldwide."
    },
    {
        icon: <ShieldCheck className="h-8 w-8" />,
        title: "Secure Checkout",
        description: "State-of-the-art encryption for your peace of mind."
    },
    {
        icon: <RefreshCw className="h-8 w-8" />,
        title: "Easy Returns",
        description: "30-day hassle-free returns on all domestic orders."
    },
    {
        icon: <Zap className="h-8 w-8" />,
        title: "Limited Drops",
        description: "Exclusive designs that never restock once sold out."
    }
];

export function BrandValues() {
    return (
        <section className="py-20 bg-primary text-primary-foreground overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto max-w-screen-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {VALUES.map((value, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="flex flex-col items-center text-center space-y-4 group"
                        >
                            <div className="p-4 rounded-2xl bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
                                {value.icon}
                            </div>
                            <h3 className="text-xl font-bold tracking-tight">{value.title}</h3>
                            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-[200px]">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
