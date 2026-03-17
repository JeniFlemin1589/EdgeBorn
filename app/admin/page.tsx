"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, Package, Users, Activity, ShoppingBag, Loader2 } from "lucide-react";
import { useOrders } from "@/context/OrderContext";
import { useProducts } from "@/context/ProductContext";

export default function AdminDashboardPage() {
    const { orders, isLoading: ordersLoading } = useOrders();
    const { products, isLoading: productsLoading } = useProducts();

    const isLoading = ordersLoading || productsLoading;

    // Calculations
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalSales = orders.length;
    const activeProducts = products.filter(p => p.status === "Active").length;
    const recentOrders = orders.slice(0, 5);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-2 hover:border-primary/20 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-70">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter italic">
                            Rs. {totalRevenue.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground font-bold mt-1">
                            Gross Lifetime Revenue
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/20 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-70">
                            Total Orders
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter italic">
                            {totalSales}
                        </div>
                        <p className="text-xs text-muted-foreground font-bold mt-1">
                            Total processed orders
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/20 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-70">
                            Live Products
                        </CardTitle>
                        <Package className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter italic">
                            {activeProducts}
                        </div>
                        <p className="text-xs text-muted-foreground font-bold mt-1">
                            Items currently in shop
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">
                            Quick Status
                        </CardTitle>
                        <Activity className="h-4 w-4 text-primary animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter italic text-primary">
                            {orders.filter(o => o.status === "Pending").length}
                        </div>
                        <p className="text-xs text-primary/70 font-bold mt-1">
                            Pending orders today
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Revenue</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-secondary/10 rounded-md">
                            [Revenue Chart Placeholder]
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 border-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Recent Orders</CardTitle>
                            <div className="text-sm text-muted-foreground font-medium mt-1">
                                You have {totalSales} orders total.
                            </div>
                        </div>
                        <ShoppingBag className="h-5 w-5 opacity-20" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center group">
                                        <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center text-primary font-black italic border-2 border-transparent group-hover:border-primary/30 transition-all">
                                            {order.customer_name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="ml-4 space-y-0.5">
                                            <p className="text-sm font-bold uppercase tracking-tight">{order.customer_name}</p>
                                            <p className="text-xs text-muted-foreground font-medium">
                                                {new Intl.DateTimeFormat('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric'
                                                }).format(new Date(order.created_at))}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-black italic tracking-tighter text-primary">
                                            Rs. {order.total.toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-10 text-muted-foreground font-bold">No orders found yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
