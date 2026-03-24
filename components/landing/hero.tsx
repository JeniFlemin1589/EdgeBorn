"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag } from "lucide-react";

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center bg-[#fdfaf5] overflow-hidden">
            {/* Split Layout Container */}
            <div className="container px-4 md:px-6 mx-auto max-w-screen-2xl">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="relative z-10 space-y-8 py-12 lg:py-20 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-4"
                        >
                            <span className="inline-block py-1 px-4 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-widest uppercase">
                                New Collection 2026
                            </span>
                            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter text-foreground leading-[0.9]">
                                UNLEASH <br />
                                YOUR <span className="text-primary italic">EDGE.</span>
                            </h1>
                            <p className="max-w-[600px] text-lg md:text-xl text-muted-foreground leading-relaxed mx-auto lg:mx-0">
                                Premium street-inspired apparel designed for the bold. Every piece is a statement of quality and independence.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
                        >
                            <Link href="/products">
                                <Button size="lg" className="h-16 px-10 text-lg rounded-full shadow-2xl shadow-primary/20 hover:scale-105 transition-transform">
                                    Shop Now <ShoppingBag className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button variant="outline" size="lg" className="h-16 px-10 text-lg rounded-full border-2 hover:bg-secondary/50 transition-colors">
                                    Our Story
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Stats/Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8 opacity-60"
                        >
                            <div className="text-center lg:text-left">
                                <div className="text-2xl font-bold">100%</div>
                                <div className="text-xs uppercase tracking-tighter">Handpicked</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-2xl font-bold">Bold</div>
                                <div className="text-xs uppercase tracking-tighter">Designs</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-2xl font-bold">Premium</div>
                                <div className="text-xs uppercase tracking-tighter">Quality</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Image Area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className="relative h-[500px] lg:h-[800px] w-full"
                    >
                        <div className="absolute inset-0 bg-primary/5 rounded-[40px] rotate-3 -z-10" />
                        <div className="absolute inset-0 bg-secondary rounded-[40px] -rotate-2 -z-10" />
                        <div className="relative h-full w-full rounded-[40px] overflow-hidden shadow-2xl">
                            <Image
                                src="/images/landing/hero-red.jpg"
                                alt="EdgeBorn Featured Hoodie"
                                fill
                                className="object-cover object-center"
                                priority
                            />
                            {/* Overlay Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.2 }}
                                className="absolute bottom-10 left-10 right-10 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hidden md:block"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-sm font-medium opacity-80">Featured Piece</div>
                                        <div className="text-xl font-bold italic">Crimson Utility Hoodie</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
