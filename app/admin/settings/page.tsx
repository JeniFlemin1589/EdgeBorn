"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Globe, Mail, Phone, MapPin, Store, CreditCard, Bell, Save, Loader2, Instagram, Facebook } from "lucide-react";

export default function AdminSettingsPage() {
    const [isLoading, setIsLoading] = useState(false);

    // Mock settings state
    const [settings, setSettings] = useState({
        storeName: "EdgeBorn",
        storeEmail: "contact@edgeborn.com",
        supportPhone: "+94 77 123 4567",
        whatsapp: "+94 77 123 4567",
        address: "Colombo, Sri Lanka",
        instagram: "@edgeborn.sl",
        facebook: "EdgeBornSL",
        currency: "LKR",
        taxRate: "0",
        shippingFee: "350"
    });

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        alert("Settings saved successfully! (Note: Persistence to DB coming soon in next update)");
    };

    return (
        <div className="space-y-6 max-w-4xl pb-20">
            <div>
                <h2 className="text-3xl font-bold tracking-tight uppercase italic tracking-tighter">Store Settings</h2>
                <p className="text-muted-foreground text-sm">Configure your storefront and business details.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* General Settings */}
                <Card className="border-2 rounded-2xl overflow-hidden shadow-sm">
                    <CardHeader className="bg-secondary/10">
                        <div className="flex items-center gap-2">
                            <Store className="h-5 w-5 text-primary" />
                            <CardTitle className="uppercase font-black text-sm tracking-widest">General Information</CardTitle>
                        </div>
                        <CardDescription>Basic store identitiy details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="storeName" className="font-bold text-xs uppercase opacity-70">Store Name</Label>
                            <Input
                                id="storeName"
                                value={settings.storeName}
                                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                                className="rounded-xl border-2 font-black italic"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="storeEmail" className="font-bold text-xs uppercase opacity-70">Support Email</Label>
                            <Input
                                id="storeEmail"
                                value={settings.storeEmail}
                                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                                className="rounded-xl border-2 font-bold"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="currency" className="font-bold text-xs uppercase opacity-70">Currency</Label>
                                <Input
                                    id="currency"
                                    value={settings.currency}
                                    disabled
                                    className="rounded-xl border-2 bg-muted font-black"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="shippingFee" className="font-bold text-xs uppercase opacity-70">Flat Shipping (Rs.)</Label>
                                <Input
                                    id="shippingFee"
                                    type="number"
                                    value={settings.shippingFee}
                                    onChange={(e) => setSettings({ ...settings, shippingFee: e.target.value })}
                                    className="rounded-xl border-2 font-black italic"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="border-2 rounded-2xl overflow-hidden shadow-sm">
                    <CardHeader className="bg-secondary/10">
                        <div className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-primary" />
                            <CardTitle className="uppercase font-black text-sm tracking-widest">Connect & Socials</CardTitle>
                        </div>
                        <CardDescription>Where customers can reach you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp" className="font-bold text-xs uppercase opacity-70 flex items-center gap-1">
                                <Phone className="h-3 w-3" /> WhatsApp / Phone
                            </Label>
                            <Input
                                id="whatsapp"
                                value={settings.whatsapp}
                                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                className="rounded-xl border-2 font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instagram" className="font-bold text-xs uppercase opacity-70 flex items-center gap-1">
                                <Instagram className="h-3 w-3" /> Instagram Profile
                            </Label>
                            <Input
                                id="instagram"
                                value={settings.instagram}
                                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                className="rounded-xl border-2 font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address" className="font-bold text-xs uppercase opacity-70 flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> Physical Address
                            </Label>
                            <textarea
                                id="address"
                                rows={2}
                                value={settings.address}
                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                className="flex min-h-[80px] w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Billing Settings */}
                <Card className="border-2 rounded-2xl overflow-hidden shadow-sm md:col-span-1">
                    <CardHeader className="bg-secondary/10">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <CardTitle className="uppercase font-black text-sm tracking-widest">Payment Methods</CardTitle>
                        </div>
                        <CardDescription>Configure how you get paid.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between p-3 border-2 rounded-xl bg-primary/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg border shadow-sm font-black italic text-xs">CASH</div>
                                <div>
                                    <p className="font-bold text-sm">Cash on Delivery</p>
                                    <p className="text-xs text-muted-foreground">Always active</p>
                                </div>
                            </div>
                            <Badge className="bg-green-500 text-white border-0">ACTIVE</Badge>
                        </div>
                        <div className="mt-4 flex items-center justify-between p-3 border-2 border-dashed rounded-xl opacity-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg border shadow-sm font-black italic text-xs">ONLINE</div>
                                <div>
                                    <p className="font-bold text-sm">Online Gateway</p>
                                    <p className="text-xs text-muted-foreground">Setup required</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="h-7 text-[10px] font-black uppercase">Configure</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="border-2 rounded-2xl overflow-hidden shadow-sm md:col-span-1">
                    <CardHeader className="bg-secondary/10">
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            <CardTitle className="uppercase font-black text-sm tracking-widest">Alerts</CardTitle>
                        </div>
                        <CardDescription>Stay notified of new business.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="font-bold text-sm">Email Notifications</p>
                            <div className="w-10 h-5 bg-primary rounded-full relative">
                                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between opacity-50">
                            <p className="font-bold text-sm">WhatsApp Alerts</p>
                            <div className="w-10 h-5 bg-muted-foreground rounded-full relative">
                                <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5" />
                            </div>
                        </div>
                        <div className="pt-2 text-xs text-muted-foreground italic font-medium">
                            Notifications are sent to {settings.storeEmail}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-6 border-t-2">
                <Button
                    size="lg"
                    onClick={handleSave}
                    disabled={isLoading}
                    className="rounded-2xl px-12 uppercase font-black tracking-widest italic shadow-lg shadow-primary/20"
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Update Settings
                </Button>
            </div>
        </div>
    );
}
