"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2, Save, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductContext";
import Image from "next/image";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "2XL"];
const AVAILABLE_COLORS = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#ffffff" },
    { name: "Navy", value: "#0f172a" },
    { name: "Red", value: "#ef4444" },
    { name: "Cream", value: "#fdfbf7" },
];

export default function NewProductPage() {
    const router = useRouter();
    const { addProduct } = useProducts();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        inventory: "0",
        category: "Men",
        theme: "",
        sizes: [] as string[],
        colors: [] as any[],
        image: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Handle File Upload (Real Local Upload)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File is too large! Please use an image under 5MB.");
                return;
            }

            // Create FormData
            const data = new FormData();
            data.append("file", file);

            try {
                // Show loading state for image?
                // For now just optimistic UI or wait
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: data,
                });

                if (!res.ok) throw new Error("Upload failed");

                const json = await res.json();
                setFormData(prev => ({ ...prev, image: json.url }));
            } catch (err) {
                console.error(err);
                alert("Failed to upload image. Please try again.");
            }
        }
    };

    // Handle Checkboxes
    const toggleSize = (size: string) => {
        setFormData(prev => {
            const current = prev.sizes;
            return {
                ...prev,
                sizes: current.includes(size)
                    ? current.filter(s => s !== size)
                    : [...current, size]
            };
        });
    };

    const toggleColor = (color: any) => {
        setFormData(prev => {
            const current = prev.colors;
            const exists = current.find(c => c.name === color.name);
            return {
                ...prev,
                colors: exists
                    ? current.filter(c => c.name !== color.name)
                    : [...current, color]
            };
        });
    };


    const handleSubmit = async () => {
        if (!formData.name || !formData.price) {
            alert("Please fill in at least Name and Price");
            return;
        }

        setIsLoading(true);

        try {
            await addProduct({
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                inventory: parseInt(formData.inventory),
                category: formData.category,
                theme: formData.theme,
                image: formData.image || "/placeholder-1.jpg",
                sizes: formData.sizes.length > 0 ? formData.sizes : ["M", "L"],
                colors: formData.colors.length > 0 ? formData.colors : [{ name: "Default", value: "#000000" }],
                status: "Active"
            });

            router.push("/admin/products");
            router.refresh(); // Ensure the page reloads with fresh data
        } catch (error: any) {
            console.error("Failed to create product:", error);
            alert(`Error adding product: ${error.message || "Unknown error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column: Details */}
                <div className="space-y-6">
                    <div className="border rounded-lg p-6 bg-card space-y-4">
                        <h3 className="font-semibold text-lg">Basic Details</h3>
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" placeholder="e.g. Classic T-Shirt" value={formData.name} onChange={handleChange} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Product description..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Unisex">Unisex</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                        </div>
                        {/* THEME FIELD */}
                        <div className="space-y-2">
                            <Label htmlFor="theme" className="text-primary font-bold">Theme / Collection</Label>
                            <Input
                                id="theme"
                                placeholder="e.g. Anime, Vintage, Cyberpunk"
                                className="border-primary/50 bg-primary/5"
                                value={formData.theme}
                                onChange={handleChange}
                            />
                            <p className="text-xs text-muted-foreground">Used for filters (Search for this term).</p>
                        </div>
                    </div>

                    <div className="border rounded-lg p-6 bg-card space-y-4">
                        <h3 className="font-semibold text-lg">Pricing & Inventory</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (Rs.)</Label>
                                <Input id="price" type="number" step="0.01" placeholder="0.00" value={formData.price} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="inventory">Inventory Count</Label>
                                <Input id="inventory" type="number" placeholder="0" value={formData.inventory} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Media & Variants */}
                <div className="space-y-6">
                    <div className="border rounded-lg p-6 bg-card space-y-4">
                        <h3 className="font-semibold text-lg">Product Image</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-center w-full">
                                <Label
                                    htmlFor="image-upload"
                                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    {formData.image ? (
                                        <div className="relative w-full h-full p-2">
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-contain rounded-md" />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-6 w-6"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setFormData(prev => ({ ...prev, image: "" }))
                                                }}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                                            <p className="text-xs text-muted-foreground">PNG, JPG (Max 5MB)</p>
                                            <Button variant="secondary" size="sm" className="mt-4 pointer-events-none">
                                                Select File
                                            </Button>
                                        </div>
                                    )}
                                    <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </Label>
                            </div>
                            <p className="text-xs text-center text-muted-foreground">Image will be uploaded to <code>public/uploads/</code></p>
                        </div>
                    </div>

                    <div className="border rounded-lg p-6 bg-card space-y-4">
                        <h3 className="font-semibold text-lg">Variants</h3>

                        <div className="space-y-3">
                            <Label>Available Sizes</Label>
                            <div className="flex flex-wrap gap-2">
                                {AVAILABLE_SIZES.map(size => (
                                    <div key={size} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`size-${size}`}
                                            checked={formData.sizes.includes(size)}
                                            onCheckedChange={() => toggleSize(size)}
                                        />
                                        <label
                                            htmlFor={`size-${size}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {size}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Label>Available Colors</Label>
                            <div className="flex flex-wrap gap-3">
                                {AVAILABLE_COLORS.map(color => (
                                    <div key={color.name} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`color-${color.name}`}
                                            checked={formData.colors.some(c => c.name === color.name)}
                                            onCheckedChange={() => toggleColor(color)}
                                        />
                                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: color.value }} />
                                        <label
                                            htmlFor={`color-${color.name}`}
                                            className="text-sm font-medium leading-none"
                                        >
                                            {color.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
                <Button variant="outline" size="lg" onClick={() => router.back()} disabled={isLoading}>Cancel</Button>
                <Button size="lg" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Product
                </Button>
            </div>
        </div >
    );
}
