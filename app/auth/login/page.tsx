"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

function LoginContent() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, profile, isLoading: authLoading } = useAuth();
    const redirect = searchParams.get("redirect") || "/";

    useEffect(() => {
        if (!authLoading && user && profile) {
            // Smart Redirect: Admins go to dashboard by default, regular users go to storefront
            if (profile.is_admin && redirect === "/") {
                router.push("/admin");
            } else {
                router.push(redirect);
            }
        }
    }, [user, profile, authLoading, router, redirect]);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = (formData.get("email") as string).trim();
        const password = (formData.get("password") as string).trim();

        try {
            // Special Override for requested Admin Credentials
            if (email === "admin123@gmail.com" && password === "admin123") {
                // We attempt to sign in normally first
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (signInError) {
                    // If the user doesn't exist, we provide a clearer instruction
                    if (signInError.message.includes("Invalid login credentials")) {
                        setError("Admin account 'admin123@gmail.com' not found or password incorrect. Please create this account in Supabase first.");
                        setIsLoading(false);
                        return;
                    }
                    throw signInError;
                }
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (signInError) throw signInError;
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Failed to sign in. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="space-y-2 text-left">
                <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-4">
                    <ArrowLeft className="mr-2 h-3 w-3" /> Back to Store
                </Link>
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Welcome back</h1>
                <p className="text-muted-foreground text-sm">
                    Enter your credentials to access your EdgeBorn account.
                </p>
            </div>

            {error && (
                <Alert variant="destructive" className="rounded-xl border-2 border-primary/20 bg-primary/5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-bold uppercase tracking-tighter italic">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-tight opacity-70">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            disabled={isLoading}
                            className="pl-10 h-12 rounded-xl bg-secondary/20 border-secondary/30 focus:bg-white transition-all"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-bold uppercase tracking-tight opacity-70">Password</Label>
                        <Link
                            href="/auth/forgot-password"
                            className="text-xs font-bold text-primary hover:underline underline-offset-4"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            disabled={isLoading}
                            className="pl-10 h-12 rounded-xl bg-secondary/20 border-secondary/30 focus:bg-white transition-all"
                        />
                    </div>
                </div>
                <Button className="w-full h-12 rounded-xl text-md font-bold uppercase tracking-widest shadow-xl shadow-primary/20" type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        "Sign In"
                    )}
                </Button>
            </form>

            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-secondary/30" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                    <span className="bg-white px-4 text-muted-foreground/60">
                        Or explore as guest
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12 rounded-xl border-secondary/40 hover:bg-secondary/10" disabled={isLoading}>
                    Google
                </Button>
                <Button variant="outline" className="h-12 rounded-xl border-secondary/40 hover:bg-secondary/10" disabled={isLoading}>
                    GitHub
                </Button>
            </div>

            <div className="text-center text-sm pt-4">
                <span className="text-muted-foreground">New to EdgeBorn?</span>{" "}
                <Link href={`/auth/signup${redirect !== "/" ? `?redirect=${redirect}` : ""}`} className="font-bold text-primary hover:underline underline-offset-4 decoration-2">
                    Create account
                </Link>
            </div>
        </div>
    );
}

import { Suspense } from "react";

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <LoginContent />
        </Suspense>
    );
}
