"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-lg border bg-secondary/20 aspect-square w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full relative"
                    >
                        {images[activeImage] ? (
                            <Image
                                src={images[activeImage]}
                                alt={`Product image ${activeImage + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
                                <span className="block text-6xl font-black opacity-10">IMG</span>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={cn(
                            "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 bg-secondary/20 transition-all hover:opacity-100",
                            activeImage === index ? "border-primary opacity-100" : "border-transparent opacity-60"
                        )}
                    >
                        {img ? (
                            <Image src={img} alt={`Thumbnail ${index + 1}`} fill className="object-cover" sizes="80px" />
                        ) : (
                            <span className="text-xs font-bold text-slate-400">{index + 1}</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
