"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Package, Calendar, Mail, MapPin, ArrowRight, Loader2, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
    const { user, profile, isLoading: authLoading } = useAuth();
    const { orders, isLoading: ordersLoading } = useOrders();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login?redirect=/account");
        }
    }, [user, authLoading, router]);

    if (authLoading || (user && ordersLoading)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex min-h-screen flex-col bg-gray-50/50">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
                <div className="space-y-8">
                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div className="space-y-1">
                            <h1 className="text-4xl font-bold tracking-tight">Account Dashboard</h1>
                            <p className="text-muted-foreground">Manage your profile and track your orders.</p>
                        </div>
                        <div className="flex gap-2">
                            {profile?.is_admin && (
                                <Link href="/admin">
                                    <Button className="rounded-xl flex gap-2">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Admin Panel
                                    </Button>
                                </Link>
                            )}
                            <Link href="/products">
                                <Button variant="outline" className="rounded-xl">Continue Shopping</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="md:col-span-1 space-y-6">
                            <Card className="rounded-3xl border-none shadow-xl shadow-primary/5 overflow-hidden">
                                <div className="h-24 bg-primary/10 w-full relative">
                                    <div className="absolute -bottom-10 left-6">
                                        <div className="h-20 w-20 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white">
                                            <User className="h-10 w-10 text-primary" />
                                        </div>
                                    </div>
                                </div>
                                <CardHeader className="pt-14">
                                    <CardTitle className="text-2xl">
                                        {profile?.first_name} {profile?.last_name}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5" />
                                        {user.email}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="pt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <Button variant="outline" className="w-full rounded-xl mt-2" disabled>
                                        Edit Profile
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="rounded-3xl border-none shadow-xl shadow-primary/5">
                                <CardHeader>
                                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    <div className="bg-primary/5 p-4 rounded-2xl space-y-1">
                                        <span className="text-2xl font-bold text-primary">{orders.length}</span>
                                        <p className="text-[10px] uppercase font-bold tracking-wider text-primary/60">Total Orders</p>
                                    </div>
                                    <div className="bg-secondary/10 p-4 rounded-2xl space-y-1">
                                        <span className="text-2xl font-bold text-secondary-foreground italic">0</span>
                                        <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Rewards</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Orders Section */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                    <Package className="h-6 w-6 text-primary" />
                                    Order History
                                </h2>
                            </div>

                            {orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <Card key={order.id} className="rounded-3xl border-none shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-shadow">
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-md font-bold tracking-tight uppercase italic">
                                                            Order #{order.order_number.split('-').pop()}
                                                        </CardTitle>
                                                        <CardDescription className="flex items-center gap-2 mt-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(order.created_at).toLocaleDateString()}
                                                        </CardDescription>
                                                    </div>
                                                    <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} className="rounded-full px-3">
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex justify-between items-center py-4 border-t border-gray-50 mt-2">
                                                    <div className="flex -space-x-3 overflow-hidden">
                                                        {order.items.slice(0, 3).map((item, idx) => (
                                                            <div key={idx} className="inline-block h-10 w-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden ring-1 ring-gray-100">
                                                                <img src={item.image || "/placeholder-1.jpg"} alt={item.name} className="h-full w-full object-cover" />
                                                            </div>
                                                        ))}
                                                        {order.items.length > 3 && (
                                                            <div className="inline-block h-10 w-10 rounded-full border-2 border-white bg-black flex items-center justify-center text-[10px] font-bold text-white ring-1 ring-gray-100">
                                                                +{order.items.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-muted-foreground uppercase font-medium">Total Amount</p>
                                                        <p className="text-lg font-black italic tracking-tighter text-primary">Rs. {order.total.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" className="w-full rounded-2xl group hover:bg-primary/5">
                                                    View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="rounded-3xl border-dashed border-2 bg-transparent">
                                    <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                                        <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-2">
                                            <Package className="h-10 w-10 text-primary/30" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-xl font-bold">No orders yet</h3>
                                            <p className="text-muted-foreground max-w-xs mx-auto">When you make a purchase, your orders will appear here.</p>
                                        </div>
                                        <Link href="/products">
                                            <Button className="rounded-full px-8">Start Shopping</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
