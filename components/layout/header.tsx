"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { CartSheet } from "@/components/cart/CartSheet";
import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard, User as UserIcon, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

export function Header() {
    const { itemCount, openCart } = useCart();
    const { user, profile, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: "/products", label: "Shop" },
        { href: "/products?category=men", label: "Men" },
        { href: "/products?category=women", label: "Women" },
        { href: "/products?category=unisex", label: "Unisex" },
        { href: "/about", label: "Our Story" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                {/* Logo & Mobile Menu */}
                <div className="flex gap-2 items-center">
                    {/* Mobile Menu Trigger */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] flex flex-col p-6">
                            <SheetHeader className="text-left mb-8">
                                <SheetTitle className="text-2xl font-black uppercase tracking-tighter italic">EdgeBorn</SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col gap-6 text-lg font-bold uppercase tracking-widest">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                            <div className="mt-auto pt-8 border-t">
                                <div className="space-y-4">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const query = (e.currentTarget.elements.namedItem("search-mobile") as HTMLInputElement).value;
                                            if (query.trim()) {
                                                setIsOpen(false);
                                                window.location.href = `/products?search=${encodeURIComponent(query)}`;
                                            }
                                        }}
                                        className="relative"
                                    >
                                        <Input
                                            name="search-mobile"
                                            placeholder="Search products..."
                                            className="h-12 w-full pr-12 rounded-xl"
                                        />
                                        <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1 h-10 w-10">
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </form>
                                    {!user && (
                                        <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full h-12 rounded-xl font-bold uppercase tracking-widest">Sign In</Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold text-xl tracking-tight">EdgeBorn</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground/60">Shop</Link>
                    <Link href="/products?category=men" className="transition-colors hover:text-foreground/80 text-foreground/60">Men</Link>
                    <Link href="/products?category=women" className="transition-colors hover:text-foreground/80 text-foreground/60">Women</Link>
                    <Link href="/products?category=unisex" className="transition-colors hover:text-foreground/80 text-foreground/60">Unisex</Link>
                    <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">Our Story</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex w-full max-w-sm items-center space-x-2">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const query = (e.currentTarget.elements.namedItem("search") as HTMLInputElement).value;
                                if (query.trim()) {
                                    window.location.href = `/products?search=${encodeURIComponent(query)}`;
                                }
                            }}
                            className="flex items-center"
                        >
                            <Input
                                name="search"
                                type="search"
                                placeholder="Search products..."
                                className="h-9 w-[200px] border-r-0 rounded-r-none focus-visible:ring-0"
                            />
                            <Button type="submit" variant="ghost" size="icon" aria-label="Search" className="border border-l-0 rounded-l-none h-9">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-1">
                            {profile?.is_admin && (
                                <Link href="/admin">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary" title="Admin Dashboard">
                                        <LayoutDashboard className="h-4 w-4" />
                                    </Button>
                                </Link>
                            )}
                            <Link href="/account">
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-secondary/20" title="My Account">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                        <UserIcon className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive active:bg-destructive/20"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    signOut();
                                }}
                                title="Sign Out"
                                type="button"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <Link href="/auth/login">
                            <Button variant="ghost" size="icon" aria-label="Account" className="h-9 w-9 rounded-xl hover:bg-secondary/20">
                                <UserIcon className="h-5 w-5" />
                            </Button>
                        </Link>
                    )}

                    <Button variant="ghost" size="icon" aria-label="Cart" className="relative" onClick={openCart}>
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </Button>
                    <CartSheet />
                </div>
            </div>
        </header>
    );
}
