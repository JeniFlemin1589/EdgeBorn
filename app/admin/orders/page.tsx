"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { useOrders, Order } from "@/context/OrderContext";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function AdminOrdersPage() {
    const { orders, isLoading, error, deleteOrder, updateOrderStatus, refreshOrders } = useOrders();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await deleteOrder(id);
        } catch (err) {
            console.error("Failed to delete order:", err);
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusBadgeClass = (status: Order["status"]) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80";
            case "Paid":
                return "bg-green-100 text-green-700 hover:bg-green-100/80";
            case "Processing":
                return "bg-blue-100 text-blue-700 hover:bg-blue-100/80";
            case "Shipped":
                return "bg-indigo-100 text-indigo-700 hover:bg-indigo-100/80";
            case "Delivered":
                return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80";
            case "Refunded":
                return "bg-orange-100 text-orange-700 hover:bg-orange-100/80";
            case "Cancelled":
                return "bg-red-100 text-red-700 hover:bg-red-100/80";
            default:
                return "bg-gray-100 text-gray-700 hover:bg-gray-100/80";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refreshOrders}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <p className="text-lg">No orders found.</p>
                    <p className="text-sm">Orders will appear here when customers place them.</p>
                </div>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.order_number}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{order.customer_name}</span>
                                            <span className="text-xs text-muted-foreground">{order.customer_email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])}
                                            className={cn(
                                                "w-full rounded-md border-0 py-1 px-2 text-xs font-bold uppercase tracking-wider focus:ring-2 focus:ring-primary transition-colors cursor-pointer",
                                                getStatusBadgeClass(order.status)
                                            )}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Refunded">Refunded</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">Rs. {order.total.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => setSelectedOrder(order)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        <span className="sr-only">View Order</span>
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent className="sm:max-w-md overflow-y-auto">
                                                    <SheetHeader>
                                                        <SheetTitle className="uppercase italic font-black text-2xl tracking-tighter">Order Details</SheetTitle>
                                                        <SheetDescription className="font-bold text-xs uppercase opacity-70">
                                                            ID: {order.order_number}
                                                        </SheetDescription>
                                                    </SheetHeader>

                                                    <div className="mt-8 space-y-6">
                                                        {/* Customer Info */}
                                                        <div className="space-y-3">
                                                            <h3 className="font-black text-sm uppercase tracking-widest text-primary border-b pb-1">Customer Info</h3>
                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                <span className="text-muted-foreground font-bold">Name:</span>
                                                                <span className="font-black italic">{order.customer_name}</span>
                                                                <span className="text-muted-foreground font-bold">Email:</span>
                                                                <span className="font-bold">{order.customer_email}</span>
                                                                <span className="text-muted-foreground font-bold">Phone:</span>
                                                                <span className="font-bold">{order.customer_phone || 'N/A'}</span>
                                                                <span className="text-muted-foreground font-bold">WhatsApp:</span>
                                                                <span className="font-bold">{order.customer_whatsapp || 'N/A'}</span>
                                                            </div>
                                                        </div>

                                                        {/* Shipping Address */}
                                                        <div className="space-y-3">
                                                            <h3 className="font-black text-sm uppercase tracking-widest text-primary border-b pb-1">Shipping Address</h3>
                                                            <p className="text-sm font-bold leading-relaxed">
                                                                {order.shipping_address?.street}<br />
                                                                {order.shipping_address?.city}, {order.shipping_address?.zip}<br />
                                                                {order.shipping_address?.country}
                                                            </p>
                                                        </div>

                                                        {/* Items */}
                                                        <div className="space-y-3">
                                                            <h3 className="font-black text-sm uppercase tracking-widest text-primary border-b pb-1">Items</h3>
                                                            <div className="space-y-3">
                                                                {order.items.map((item, idx) => (
                                                                    <div key={idx} className="flex justify-between items-center text-sm border-b border-dashed pb-2">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="h-10 w-10 bg-secondary/20 rounded-lg flex-shrink-0" />
                                                                            <div className="flex flex-col">
                                                                                <span className="font-black tracking-tight">{item.name}</span>
                                                                                <span className="text-[10px] text-muted-foreground font-bold uppercase">
                                                                                    {item.size} / {item.color} x {item.quantity}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <span className="font-black italic">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Total */}
                                                        <div className="pt-4 flex justify-between items-center">
                                                            <span className="font-black uppercase tracking-widest text-lg">Total</span>
                                                            <span className="text-2xl font-black italic tracking-tighter text-primary">
                                                                Rs. {order.total.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </SheetContent>
                                            </Sheet>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        disabled={deletingId === order.id}
                                                    >
                                                        {deletingId === order.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                        <span className="sr-only">Delete Order</span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Order?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete order <strong>{order.order_number}</strong>?
                                                            This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(order.id)}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
