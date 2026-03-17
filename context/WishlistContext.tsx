"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface WishlistContextType {
    wishlist: string[]; // Array of product IDs
    toggleFavorite: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<string[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem("edgeborn-wishlist");
        if (savedWishlist) {
            try {
                setWishlist(JSON.parse(savedWishlist));
            } catch (e) {
                console.error("Failed to parse wishlist", e);
            }
        }
    }, []);

    // Save to localStorage whenever wishlist changes
    useEffect(() => {
        localStorage.setItem("edgeborn-wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleFavorite = (productId: string) => {
        setWishlist((prev) => {
            if (prev.includes(productId)) {
                return prev.filter((id) => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    const isFavorite = (productId: string) => {
        return wishlist.includes(productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleFavorite, isFavorite }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
