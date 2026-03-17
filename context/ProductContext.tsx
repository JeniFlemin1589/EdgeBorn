"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

// Define the Product type
export type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    category: string;
    theme: string;
    sizes: string[];
    colors: { name: string; value: string }[];
    inventory: number;
    status: "Active" | "Draft";
    created_at: string;
};

interface ProductContextType {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    addProduct: (product: Omit<Product, "id" | "created_at">) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    refreshProducts: () => Promise<void>;
    getThemes: () => string[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch products from Supabase
    const fetchProducts = useCallback(async (isInitialLoad = false) => {
        if (isInitialLoad && products.length === 0) {
            setIsLoading(true);
        }
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });

            if (fetchError) {
                throw fetchError;
            }

            // Transform data to match our Product type
            const transformedProducts: Product[] = (data || []).map((p) => ({
                id: p.id,
                name: p.name,
                price: Number(p.price),
                image: p.image || "",
                description: p.description || "",
                category: p.category || "",
                theme: p.theme || "",
                sizes: p.sizes || [],
                colors: p.colors || [],
                inventory: p.inventory || 0,
                status: p.status as "Active" | "Draft",
                created_at: p.created_at,
            }));

            setProducts(transformedProducts);

            // Update Cache
            if (typeof window !== 'undefined') {
                localStorage.setItem('edgeborn-products-cache', JSON.stringify(transformedProducts));
                localStorage.setItem('edgeborn-products-cache-time', Date.now().toString());
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [products.length]);

    // Load products on mount
    useEffect(() => {
        // 1. Try to load from cache first for instant UI
        if (typeof window !== 'undefined') {
            const cachedProducts = localStorage.getItem('edgeborn-products-cache');
            if (cachedProducts) {
                try {
                    const parsed = JSON.parse(cachedProducts);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setProducts(parsed);
                        setIsLoading(false); // We have something to show
                    }
                } catch (e) {
                    console.warn("Failed to parse product cache", e);
                }
            }
        }

        // 2. Fetch fresh data from Supabase
        fetchProducts(true);
    }, [fetchProducts]);

    // Add a new product
    const addProduct = async (newProductData: Omit<Product, "id" | "created_at">) => {
        setError(null);
        try {
            const { data, error: insertError } = await supabase
                .from("products")
                .insert([{
                    name: newProductData.name,
                    price: newProductData.price,
                    image: newProductData.image,
                    description: newProductData.description,
                    category: newProductData.category,
                    theme: newProductData.theme,
                    sizes: newProductData.sizes,
                    colors: newProductData.colors,
                    inventory: newProductData.inventory,
                    status: newProductData.status,
                }])
                .select()
                .single();

            if (insertError) {
                throw insertError;
            }

            if (data) {
                console.log("Product successfully added to Supabase:", data);
                const newProduct: Product = {
                    id: data.id,
                    name: data.name,
                    price: Number(data.price),
                    image: data.image || "",
                    description: data.description || "",
                    category: data.category || "",
                    theme: data.theme || "",
                    sizes: data.sizes || [],
                    colors: data.colors || [],
                    inventory: data.inventory || 0,
                    status: data.status as "Active" | "Draft",
                    created_at: data.created_at,
                };
                setProducts((prev) => [newProduct, ...prev]);
                console.log("Local product state updated.");
            }
        } catch (err) {
            console.error("Error in ProductContext addProduct:", err);
            setError("Failed to add product. Please try again.");
            throw err;
        }
    };

    // Update an existing product
    const updateProduct = async (id: string, updates: Partial<Product>) => {
        setError(null);
        try {
            const { error: updateError } = await supabase
                .from("products")
                .update(updates)
                .eq("id", id);

            if (updateError) {
                throw updateError;
            }

            setProducts((prev) =>
                prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
            );
        } catch (err) {
            console.error("Error updating product:", err);
            setError("Failed to update product. Please try again.");
            throw err;
        }
    };

    // Delete a product
    const deleteProduct = async (id: string) => {
        setError(null);
        try {
            const { error: deleteError } = await supabase
                .from("products")
                .delete()
                .eq("id", id);

            if (deleteError) {
                throw deleteError;
            }

            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error("Error deleting product:", err);
            setError("Failed to delete product. Please try again.");
            throw err;
        }
    };

    // Extract unique themes
    const getThemes = () => {
        const themes = new Set(products.map((p) => p.theme));
        return Array.from(themes).filter(Boolean);
    };

    return (
        <ProductContext.Provider
            value={{
                products,
                isLoading,
                error,
                addProduct,
                updateProduct,
                deleteProduct,
                refreshProducts: fetchProducts,
                getThemes,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error("useProducts must be used within a ProductProvider");
    }
    return context;
}
