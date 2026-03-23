import Link from "next/link";
import { Facebook } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t border-border/40 bg-background pt-16 pb-8">
            <div className="container px-4 md:px-8 max-w-screen-2xl">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="font-bold text-xl tracking-tight">EdgeBorn</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Premium apparel for the modern creator. Designed for comfort, styled for impact.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 lg:col-span-2">
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold tracking-wide uppercase text-foreground">Shop</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/products?category=men" className="hover:text-foreground">Men</Link></li>
                                <li><Link href="/products?category=women" className="hover:text-foreground">Women</Link></li>
                                <li><Link href="/products?category=unisex" className="hover:text-foreground">Unisex</Link></li>
                                <li><Link href="/products?category=accessories" className="hover:text-foreground">Accessories</Link></li>
                                <li><Link href="/products?sort=newest" className="hover:text-foreground">New Arrivals</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold tracking-wide uppercase text-foreground">Support</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/contact" className="hover:text-foreground">Contact Us</Link></li>
                                <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
                                <li><Link href="/shipping" className="hover:text-foreground">Shipping</Link></li>
                                <li><Link href="/returns" className="hover:text-foreground">Returns</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold tracking-wide uppercase text-foreground">Follow Us</h4>
                        <p className="text-sm text-muted-foreground">
                            Stay connected with EdgeBorn on social media for the latest drops and updates.
                        </p>
                        <div className="flex gap-4 mt-4">
                            <a
                                href="https://www.facebook.com/share/1BQ8NVhQMp/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} EdgeBorn. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
