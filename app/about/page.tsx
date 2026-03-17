"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-24 md:py-40 overflow-hidden text-white">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/images/about/hero.jpg"
                            alt="EdgeBorn Lifestyle"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    <div className="container px-4 md:px-6 mx-auto max-w-screen-2xl relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-3xl space-y-6"
                        >
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
                                Crafting Quality <br />
                                <span className="text-primary italic">Since 2026.</span>
                            </h1>
                            <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                                EdgeBorn represents the intersection of modern street culture and premium craftsmanship. We don't just sell clothes; we build identities that bridge the gap between elegance and edge.
                            </p>
                            <div className="pt-4">
                                <Link href="/products">
                                    <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                                        Explore Collection <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Our Story Section */}
                <section className="py-20 md:py-32 bg-background relative overflow-hidden">
                    <div className="container px-4 md:px-6 mx-auto max-w-screen-2xl">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-primary/10"
                            >
                                <Image
                                    src="/images/about/story.jpg"
                                    alt="Our Journey"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <span className="text-primary font-bold tracking-widest uppercase text-sm">Our Genesis</span>
                                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Redefining Modern Essentials</h2>
                                </div>

                                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                                    <p>
                                        Started in a small studio in 2026, EdgeBorn began with a simple question: Why do we have to choose between comfort and style?
                                    </p>
                                    <p>
                                        We spent months sourcing the finest cotton blends, perfecting cuts that flatter every body type, and testing durability in real-world scenarios. What started as a passion project for local artists has grown into a global community of tastemakers.
                                    </p>
                                    <p>
                                        Today, every piece is designed with intention. We believe in slow fashion—creating high-quality staples that are meant to last for years, reducing waste while elevating your everyday look.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                                    {[
                                        "Global Material Sourcing",
                                        "Ethical Manufacturing",
                                        "Built for Longevity",
                                        "Eco-Conscious Packaging"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-secondary/10 p-4 rounded-xl border border-secondary/20">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            <span className="font-semibold text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Design Philosophy Section */}
                <section className="py-20 md:py-32 bg-secondary/5">
                    <div className="container px-4 md:px-6 mx-auto max-w-screen-2xl">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="order-2 md:order-1 space-y-8"
                            >
                                <div className="space-y-4">
                                    <span className="text-primary font-bold tracking-widest uppercase text-sm">Design Ethos</span>
                                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Where Art Meets Apparel</h2>
                                </div>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Our design philosophy is rooted in the "Edgeborn" concept—the idea that greatness is born at the edges of tradition and innovation. We collaborate with world-class illustrators to bring unique, limited-edition themes to life, ensuring that your wardrobe is as unique as your story.
                                </p>
                                <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-2xl font-serif text-foreground">
                                    "Fashion is the most powerful art there is. It's movement, design, and architecture all in one."
                                </blockquote>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="order-1 md:order-2 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
                            >
                                <Image
                                    src="/images/about/lifestyle.jpg"
                                    alt="Artist Collaboration"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Values / CTA */}
                <section className="relative py-24 overflow-hidden bg-primary text-primary-foreground">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
                    </div>

                    <div className="container px-4 md:px-6 mx-auto max-w-screen-2xl text-center space-y-10 relative z-10">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Ready to Find Your Edge?</h2>
                        <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
                            Join over 50,000 trendsetters who have redefined their style with EdgeBorn essentials.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
                            <Link href="/products">
                                <Button size="lg" variant="secondary" className="h-16 px-12 text-xl rounded-full shadow-xl hover:scale-105 transition-transform">
                                    Shop the Collection
                                </Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button size="lg" variant="outline" className="h-16 px-12 text-xl rounded-full border-2 bg-transparent border-white text-white hover:bg-white hover:text-primary transition-all">
                                    Join the Club
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
