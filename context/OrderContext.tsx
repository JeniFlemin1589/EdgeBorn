"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

// Define the Order type
export type OrderItem = {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    image?: string;
};

export type Order = {
    id: string;
    user_id?: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    customer_whatsapp?: string;
    status: "Pending" | "Paid" | "Processing" | "Shipped" | "Delivered" | "Refunded" | "Cancelled";
    total: number;
    items: OrderItem[];
    shipping_address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    created_at: string;
};

interface OrderContextType {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    addOrder: (order: Omit<Order, "id" | "order_number" | "created_at">) => Promise<Order | null>;
    updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
    refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Generate a unique order number
function generateOrderNumber(): string {
    const prefix = "ORD";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    // Fetch orders from Supabase
    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (!user) {
                setOrders([]);
                setIsLoading(false);
                return;
            }

            let query = supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false });

            // If not admin, only fetch own orders
            const { data: profileData } = await supabase
                .from("profiles")
                .select("is_admin")
                .eq("id", user.id)
                .single();

            if (!profileData?.is_admin) {
                query = query.eq("user_id", user.id);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) {
                throw fetchError;
            }

            // Transform data to match our Order type
            const transformedOrders: Order[] = (data || []).map((o) => ({
                id: o.id,
                user_id: o.user_id,
                order_number: o.order_number,
                customer_name: o.customer_name,
                customer_email: o.customer_email,
                customer_phone: o.customer_phone,
                customer_whatsapp: o.customer_whatsapp,
                status: o.status as Order["status"],
                total: Number(o.total),
                items: o.items || [],
                shipping_address: o.shipping_address,
                created_at: o.created_at,
            }));

            setOrders(transformedOrders);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Failed to load orders. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Load orders on mount and when user changes
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders, user]);

    // Add a new order
    const addOrder = async (newOrderData: Omit<Order, "id" | "order_number" | "created_at">): Promise<Order | null> => {
        setError(null);
        try {
            const orderNumber = generateOrderNumber();

            console.log("Starting Supabase insert for order:", orderNumber);

            // 1. Perform the insert
            // We use a timeout to prevent absolute hangs
            const insertPromise = supabase
                .from("orders")
                .insert([{
                    user_id: newOrderData.user_id,
                    order_number: orderNumber,
                    customer_name: newOrderData.customer_name,
                    customer_email: newOrderData.customer_email,
                    customer_phone: newOrderData.customer_phone,
                    customer_whatsapp: newOrderData.customer_whatsapp,
                    status: newOrderData.status,
                    total: newOrderData.total,
                    items: newOrderData.items,
                    shipping_address: newOrderData.shipping_address,
                }])
                .select();

            // 8 second timeout - much better UX
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Order save is taking longer than expected. Proceeding with email notification.")), 8000)
            );

            const { data, error: insertError } = await Promise.race([insertPromise, timeoutPromise]) as any;

            if (insertError) {
                console.error("Supabase Insert Error:", insertError);
                throw insertError;
            }

            if (data && data.length > 0) {
                const row = data[0];
                const newOrder: Order = {
                    id: row.id,
                    user_id: row.user_id,
                    order_number: row.order_number,
                    customer_name: row.customer_name,
                    customer_email: row.customer_email,
                    customer_phone: row.customer_phone,
                    customer_whatsapp: row.customer_whatsapp,
                    status: row.status as Order["status"],
                    total: Number(row.total),
                    items: row.items || [],
                    shipping_address: row.shipping_address,
                    created_at: row.created_at,
                };
                setOrders((prev) => [newOrder, ...prev]);
                return newOrder;
            }
            
            // Fallback if select() returned nothing but no error (RLS issue likely)
            console.warn("Order inserted but not returned in select. Returning mock order.");
            const mockOrder: Order = {
                id: Math.random().toString(36).substr(2, 9), // Temporary ID
                order_number: orderNumber,
                ...newOrderData,
                created_at: new Date().toISOString(),
            };
            return mockOrder;
        } catch (err: any) {
            console.error("Order Creation Logic Exception:", err);
            // We set the error in state but DON'T re-throw if it's a timeout
            // because we want the UI to proceed to the email step if possible
            setError(err.message);
            if (err.message.includes("longer than expected")) {
                return null; // Signals timeout to caller
            }
            throw err;
        }
    };

    // Update order status
    const updateOrderStatus = async (id: string, status: Order["status"]) => {
        setError(null);
        try {
            const { error: updateError } = await supabase
                .from("orders")
                .update({ status })
                .eq("id", id);

            if (updateError) {
                throw updateError;
            }

            setOrders((prev) =>
                prev.map((o) => (o.id === id ? { ...o, status } : o))
            );
        } catch (err) {
            console.error("Error updating order:", err);
            setError("Failed to update order. Please try again.");
            throw err;
        }
    };

    // Delete an order
    const deleteOrder = async (id: string) => {
        setError(null);
        try {
            const { error: deleteError } = await supabase
                .from("orders")
                .delete()
                .eq("id", id);

            if (deleteError) {
                throw deleteError;
            }

            setOrders((prev) => prev.filter((o) => o.id !== id));
        } catch (err) {
            console.error("Error deleting order:", err);
            setError("Failed to delete order. Please try again.");
            throw err;
        }
    };

    return (
        <OrderContext.Provider
            value={{
                orders,
                isLoading,
                error,
                addOrder,
                updateOrderStatus,
                deleteOrder,
                refreshOrders: fetchOrders,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error("useOrders must be used within an OrderProvider");
    }
    return context;
}
