"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    size: string;
    color: string;
    quantity: number;
    stock: number;
};

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "id">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
    subtotal: number;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Load cart from local storage on mount
    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem("edgeborn-cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save cart to local storage whenever items change
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("edgeborn-cart", JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addItem = (newItem: Omit<CartItem, "id">) => {
        setItems((currentItems) => {
            // Check if item already exists (same product, size, and color)
            const existingItemIndex = currentItems.findIndex(
                (item) =>
                    item.productId === newItem.productId &&
                    item.size === newItem.size &&
                    item.color === newItem.color
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...currentItems];
                const existing = updatedItems[existingItemIndex];
                updatedItems[existingItemIndex].quantity = Math.min(existing.quantity + newItem.quantity, newItem.stock ?? 99);
                return updatedItems;
            }

            // Generate a unique ID for the cart line item
            const id = `${newItem.productId}-${newItem.size}-${newItem.color}-${Date.now()}`;
            return [...currentItems, { ...newItem, id }];
        });
        setIsCartOpen(true);
    };

    const removeItem = (id: string) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === id ? { ...item, quantity: Math.min(quantity, item.stock ?? 99) } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                itemCount,
                subtotal,
                isCartOpen,
                openCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
