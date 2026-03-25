"use client";

import { useCart } from "@/context/CartContext";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CartSheet() {
    const { items, removeItem, updateQuantity, subtotal, isCartOpen, closeCart } = useCart();
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const shippingFee = totalQuantity >= 5 ? 0 : 250;
    const totalAmount = subtotal + shippingFee;

    return (
        <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader className="border-b pb-4">
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" /> Your Cart
                        <span className="text-sm font-normal text-muted-foreground ml-2">({items.length} items)</span>
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        <ShoppingCart className="h-16 w-16 text-muted-foreground/30" />
                        <p className="text-muted-foreground text-lg">Your cart is empty.</p>
                        <SheetClose asChild>
                            <Button variant="outline">Continue Shopping</Button>
                        </SheetClose>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 pr-4 -mr-4">
                            <div className="space-y-6 pt-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-secondary/20 flex-shrink-0">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground bg-slate-100">PRODUCT</div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <div className="flex justify-between">
                                                <Link href={`/products/${item.productId}`} onClick={closeCart} className="font-medium hover:underline line-clamp-1">
                                                    {item.name}
                                                </Link>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                {item.size} • {item.color}
                                            </div>
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center border rounded-md h-8">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="px-2 hover:bg-muted transition-colors h-full"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="px-2 text-sm font-medium w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-2 hover:bg-muted transition-colors h-full"
                                                        disabled={item.stock !== undefined ? item.quantity >= item.stock : false}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <span className="font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <SheetFooter className="border-t pt-6 flex-col gap-4 sm:flex-col sm:space-x-0">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>Rs. {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className={shippingFee === 0 ? "text-green-600" : ""}>
                                    {shippingFee === 0 ? "Free" : `Rs. ${shippingFee.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                                <span>Total</span>
                                <span className="text-primary">Rs. {totalAmount.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                                Shipping and taxes calculated at checkout.
                            </p>
                            <div className="grid gap-2">
                                <Link href="/checkout" onClick={closeCart} className="w-full">
                                    <Button className="w-full" size="lg">Checkout</Button>
                                </Link>
                                <SheetClose asChild>
                                    <Button variant="outline" className="w-full">Continue Shopping</Button>
                                </SheetClose>
                            </div>
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
