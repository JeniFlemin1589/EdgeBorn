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
    const { user, profile, isLoading: authLoading, signInWithGoogle } = useAuth();
    const redirect = searchParams.get("redirect") || "/";

    useEffect(() => {
        // Redirect as soon as user is authenticated (don't wait for profile)
        if (!authLoading && user) {
            // If profile is loaded and user is admin, send to admin
            if (profile?.is_admin && redirect === "/") {
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
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                if (signInError.message.includes("Invalid login credentials")) {
                    setError("Invalid email or password. Please try again.");
                } else {
                    setError(signInError.message);
                }
                setIsLoading(false);
                return;
            }

            // Sign-in succeeded — force redirect immediately as fallback
            // This ensures navigation even if the useEffect doesn't fire fast enough
            if (data?.user) {
                window.location.href = redirect;
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Failed to sign in. Please check your credentials.");
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

            <div className="pt-2">
                <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl border-secondary/40 hover:bg-secondary/10 font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                    onClick={async () => {
                        try {
                            setIsLoading(true);
                            await signInWithGoogle();
                        } catch (err: any) {
                            setError(err.message || "Failed to sign in with Google.");
                            setIsLoading(false);
                        }
                    }}
                    disabled={isLoading}
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
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
