"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function CartPage() {
    const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const shippingFee = totalQuantity >= 5 ? 0 : 250;
    const totalAmount = subtotal + shippingFee;

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container px-4 md:px-6 py-6 md:py-12 mx-auto max-w-screen-2xl">
                <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-6 border rounded-lg bg-secondary/10">
                        <div className="h-24 w-24 rounded-full bg-secondary/30 flex items-center justify-center">
                            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-semibold">Your cart is empty</h2>
                            <p className="text-muted-foreground max-w-sm">Looks like you haven't added anything to your cart yet.</p>
                        </div>
                        <Link href="/products">
                            <Button size="lg">Start Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b">
                                <span className="font-semibold">{items.length} Items</span>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80 hover:bg-destructive/10" onClick={clearCart}>
                                    Clear Cart
                                </Button>
                            </div>

                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 sm:gap-6 py-4 border-b last:border-0">
                                    <div className="relative h-24 w-24 sm:h-32 sm:w-32 overflow-hidden rounded-md border bg-secondary/20 flex-shrink-0">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="128px" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground bg-slate-100 font-bold">PRODUCT</div>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link href={`/products/${item.productId}`} className="font-semibold text-lg hover:underline">
                                                    {item.name}
                                                </Link>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Size: {item.size} | Color: {item.color}
                                                </p>
                                            </div>
                                            <p className="font-bold text-lg hidden sm:block">
                                                Rs. {(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center border rounded-md">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 hover:bg-muted transition-colors"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="px-4 font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:bg-muted transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <p className="font-bold sm:hidden">
                                                    Rs. {(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-secondary/20 rounded-lg p-6 space-y-6 sticky top-24">
                                <h2 className="text-xl font-semibold">Order Summary</h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className={cn("font-medium", shippingFee === 0 ? "text-green-600" : "")}>
                                            {shippingFee === 0 ? "Free" : `Rs. ${shippingFee.toFixed(2)}`}
                                        </span>
                                    </div>
                                    {shippingFee > 0 && (
                                        <p className="text-[10px] text-muted-foreground italic -mt-2 text-right">
                                            Add {5 - totalQuantity} more items for free shipping!
                                        </p>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tax</span>
                                        <span className="text-muted-foreground text-sm">Calculated at checkout</span>
                                    </div>

                                    <div className="border-t pt-4 flex justify-between items-center">
                                        <span className="font-bold text-lg">Total</span>
                                        <span className="font-bold text-xl text-primary">Rs. {totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button size="lg" className="w-full text-base h-12">
                                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>

                                <div className="text-xs text-muted-foreground text-center space-y-2">
                                    <p>Secure Checkout - SSL Encrypted</p>
                                    <p>30-Day Money Back Guarantee</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
