"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const COLLECTIONS = [
    {
        title: "Urban Essentials",
        description: "Versatile staples designed for daily rhythm.",
        image: "/images/landing/category-tan.jpg",
        href: "/products?category=Unisex",
        size: "large"
    },
    {
        title: "Crimson Edition",
        description: "Bold statements in deep red hues.",
        image: "/images/landing/featured-red.jpg",
        href: "/products?theme=Anime",
        size: "small"
    },
    {
        title: "Artisan Cuts",
        description: "Premium materials, perfected patterns.",
        image: "/images/landing/hero-red.jpg",
        href: "/products",
        size: "small"
    }
];

export function CollectionsGrid() {
    return (
        <section className="py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto max-w-screen-2xl">
                <div className="flex flex-col items-center mb-16 text-center space-y-4">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs">Curated Selection</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter">OUR COLLECTIONS</h2>
                    <p className="text-muted-foreground max-w-lg">
                        Explore our latest drops, where each collection tells a unique story of craft and culture.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 h-[800px]">
                    {/* Large Card */}
                    <Link href={COLLECTIONS[0].href} className="group relative overflow-hidden rounded-3xl h-full">
                        <Image
                            src={COLLECTIONS[0].image}
                            alt={COLLECTIONS[0].title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-10 left-10 p-2 text-white">
                            <h3 className="text-3xl font-bold mb-2">{COLLECTIONS[0].title}</h3>
                            <p className="text-white/70 max-w-xs mb-6">{COLLECTIONS[0].description}</p>
                            <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm">
                                Explore <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </div>
                    </Link>

                    {/* Smaller Cards Column */}
                    <div className="grid md:grid-rows-2 gap-6 h-full">
                        {COLLECTIONS.slice(1).map((collection, i) => (
                            <Link key={i} href={collection.href} className="group relative overflow-hidden rounded-3xl h-full">
                                <Image
                                    src={collection.image}
                                    alt={collection.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-8 left-8 p-1 text-white">
                                    <h3 className="text-2xl font-bold mb-1">{collection.title}</h3>
                                    <p className="text-white/70 text-sm max-w-xs mb-4">{collection.description}</p>
                                    <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                                        View Details <ArrowUpRight className="h-3 w-3" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
