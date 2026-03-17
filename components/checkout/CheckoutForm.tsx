"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, CreditCard, Truck, AlertCircle, Mail, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STEPS = [
    { id: 1, title: "Shipping", icon: Truck },
    { id: 2, title: "Payment", icon: CreditCard },
    { id: 3, title: "Review", icon: CheckCircle2 },
];

export function CheckoutForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processStatus, setProcessStatus] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState("email");

    // Form fields
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        whatsapp: "",
        address: "",
        city: "",
        zip: "",
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
    });

    const { items, subtotal, clearCart } = useCart();
    const { addOrder } = useOrders();
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const shippingFee = totalQuantity >= 5 ? 0 : 250;
    const totalAmount = subtotal + shippingFee;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleNext = () => {
        // Simple validation for step 1
        if (currentStep === 1) {
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address) {
                alert("Please fill in all shipping and contact details.");
                return;
            }
        }
        setCurrentStep((prev) => Math.min(prev + 1, 3));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmitOrder = async () => {
        setIsProcessing(true);
        setProcessStatus("Finalizing your order...");
        
        try {
            const customerName = `${formData.firstName} ${formData.lastName}`;
            const orderToCreate = {
                user_id: user?.id,
                customer_name: customerName,
                customer_email: formData.email,
                customer_phone: formData.phone,
                customer_whatsapp: formData.whatsapp || formData.phone,
                status: "Pending" as const,
                total: totalAmount,
                items: items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                    image: item.image
                })),
                shipping_address: {
                    street: formData.address,
                    city: formData.city,
                    state: "",
                    zip: formData.zip,
                    country: "Sri Lanka"
                }
            };

            // 1. Try to create order in Supabase
            let order = await addOrder(orderToCreate);
            let usedFallback = false;

            // If DB save timed out, we create a fallback order object for the email
            if (!order) {
                console.warn("Database timeout detected. Falling back to email-only notification.");
                usedFallback = true;
                order = {
                    ...orderToCreate,
                    id: `temp-${Date.now()}`,
                    order_number: `EMAIL-${Date.now().toString(36).toUpperCase()}`,
                    created_at: new Date().toISOString()
                } as any;
            }

            if (order) {
                // 2. Clear cart
                clearCart();
                
                // 3. Trigger email notification
                if (paymentMethod === "email") {
                    setProcessStatus("Verifying delivery details...");
                    try {
                        const emailResponse = await fetch("/api/checkout/email-order", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(order)
                        });
                        
                        if (!emailResponse.ok) {
                            console.warn("Email service returned error status");
                        }
                    } catch (emailErr) {
                        console.error("Email notification failed:", emailErr);
                    }
                }

                // 4. Redirect to success page
                setProcessStatus("Order Received! Redirecting...");
                router.push("/checkout/success");
            }
        } catch (error: any) {
            console.error("Checkout critical failure:", error);
            // Only show alert for REAL errors, not timeouts which we handle above
            if (!error.message?.includes("longer than expected")) {
                alert(`Checkout issue: ${error.message || "Please check your connection"}`);
            }
            setIsProcessing(false);
            setProcessStatus("");
        }
    };

    if (isAuthLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Securing your session...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8 bg-secondary/5 rounded-3xl border-2 border-dashed border-secondary/20 p-12">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <Lock className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-4 max-w-md">
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">Authentication Required</h2>
                    <p className="text-muted-foreground">
                        To protect your data and ensure a smooth delivery experience, please log in or create an account before proceeding to checkout.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <Link href="/auth/login?redirect=/checkout" className="flex-1">
                        <Button className="w-full h-14 rounded-xl text-lg font-bold uppercase tracking-widest leading-none">Sign In</Button>
                    </Link>
                    <Link href="/auth/signup?redirect=/checkout" className="flex-1">
                        <Button variant="outline" className="w-full h-14 rounded-xl text-lg font-bold uppercase tracking-widest border-2 leading-none">Create Account</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form Steps */}
            <div className="lg:col-span-2 space-y-6">
                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-8 px-4">
                    {STEPS.map((step) => {
                        const Icon = step.icon;
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center relative z-10">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-background",
                                    isActive ? "border-primary text-primary" :
                                        isCompleted ? "border-primary bg-primary text-primary-foreground" :
                                            "border-muted-foreground text-muted-foreground"
                                )}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className={cn(
                                    "text-xs font-medium mt-2",
                                    isActive || isCompleted ? "text-primary" : "text-muted-foreground"
                                )}>{step.title}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-background border rounded-lg p-6 shadow-sm min-h-[400px]">
                    {currentStep === 1 && (
                        <div className="space-y-4 animate-in fade-in duration-500">
                            <h2 className="text-xl font-semibold mb-4 text-primary">Shipping Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" placeholder="John" value={formData.firstName} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address for Order Confirmation</Label>
                                <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" placeholder="07XXXXXXXX" value={formData.phone} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp">WhatsApp Number (Optional)</Label>
                                    <Input id="whatsapp" placeholder="07XXXXXXXX" value={formData.whatsapp} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Full Shipping Address</Label>
                                <Input id="address" placeholder="123 Street Name, Area" value={formData.address} onChange={handleInputChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" placeholder="Colombo" value={formData.city} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zip">Postal Code</Label>
                                    <Input id="zip" placeholder="10XXX" value={formData.zip} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <h2 className="text-xl font-semibold mb-4 text-primary">Order Confirmation</h2>

                            <div className="p-8 border-2 border-dashed rounded-2xl bg-primary/5 flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Mail className="h-8 w-8 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold uppercase tracking-tight">Order via Email</h3>
                                    <p className="text-muted-foreground max-w-sm">
                                        We currently only accept orders via email for manual processing and bank transfers.
                                        Our team will contact you on <strong>WhatsApp</strong> or <strong>Email</strong> to share payment details once your order is processed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-4 animate-in fade-in duration-500">
                            <h2 className="text-xl font-semibold mb-4 text-primary">Review Order</h2>
                            <div className="space-y-4 border rounded-md p-6 bg-secondary/5">
                                <div className="space-y-2">
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Contact Details</p>
                                    <p className="text-sm font-medium">{formData.firstName} {formData.lastName}</p>
                                    <p className="text-sm text-muted-foreground">{formData.phone} {formData.whatsapp ? `(WA: ${formData.whatsapp})` : ""}</p>
                                    <p className="text-sm text-muted-foreground">{formData.address}, {formData.city} {formData.zip}</p>
                                </div>
                                <hr />
                                <div className="space-y-2">
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Payment Method</p>
                                    <p className="text-sm font-medium">Order via Email (Bank Transfer)</p>
                                </div>
                                <hr />
                                <div className="space-y-3">
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Order Items</p>
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>{item.quantity}x {item.name} <span className="text-muted-foreground ml-1">({item.size})</span></span>
                                            <span className="font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between text-sm pt-2 border-t">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className="font-semibold">{shippingFee === 0 ? "FREE" : `Rs. ${shippingFee.toFixed(2)}`}</span>
                                    </div>
                                </div>
                                <div className="border-t pt-4 flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span className="text-primary">Rs. {totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-8 pt-4 border-t">
                        <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1}>
                            Back
                        </Button>

                        {currentStep < 3 ? (
                            <Button onClick={handleNext} className="min-w-[120px]">Next Step</Button>
                        ) : (
                            <Button onClick={handleSubmitOrder} disabled={isProcessing} className="min-w-[150px]">
                                {isProcessing ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-xs">{processStatus}</span>
                                    </div>
                                ) : "Place Order"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Mini Cart Summary */}
            <div className="lg:col-span-1">
                <div className="bg-background border rounded-lg p-6 shadow-sm sticky top-24">
                    <h3 className="font-semibold mb-4 border-b pb-2">Summary</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Items ({totalQuantity})</span>
                            <span>Rs. {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className={cn("font-medium", shippingFee === 0 ? "text-green-600" : "")}>
                                {shippingFee === 0 ? "Free" : `Rs. ${shippingFee.toFixed(2)}`}
                            </span>
                        </div>
                        {shippingFee > 0 && (
                            <p className="text-[10px] text-muted-foreground italic -mt-2">
                                Add {5 - totalQuantity} more items for free shipping!
                            </p>
                        )}
                        <div className="border-t pt-3 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-primary">Rs. {totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Items List Preview */}
                    <div className="mt-6 pt-6 border-t space-y-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Items</p>
                        {items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex gap-3">
                                <div className="bg-secondary/20 rounded h-10 w-10 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{item.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{item.quantity} x Rs. {item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                        {items.length > 3 && (
                            <p className="text-[10px] text-center text-muted-foreground">and {items.length - 3} more items</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
