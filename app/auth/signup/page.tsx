"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Mail, Lock, User, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const redirect = searchParams.get("redirect") || "/";

    useEffect(() => {
        if (user) {
            router.push(redirect);
        }
    }, [user, router, redirect]);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = (formData.get("email") as string).trim();
        const password = (formData.get("password") as string).trim();
        const firstName = (formData.get("firstName") as string).trim();
        const lastName = (formData.get("lastName") as string).trim();

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                    },
                },
            });

            if (signUpError) throw signUpError;

            // If the session is available, they were auto-logged in (Confirm Email is OFF)
            if (data.session) {
                router.push(redirect);
            } else {
                // Confirm Email is likely ON
                alert("Account created! Please check your email to confirm your account, then sign in.");
                router.push(`/auth/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`);
            }
        } catch (err: any) {
            console.error("Signup error:", err);
            setError(err.message || "Failed to create account. Please try again.");
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
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Create Account</h1>
                <p className="text-muted-foreground text-sm">
                    Join the EdgeBorn community and define your style.
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
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-tight opacity-70">First name</Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                            required
                            disabled={isLoading}
                            className="h-12 rounded-xl bg-secondary/20 border-secondary/30 focus:bg-white transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-tight opacity-70">Last name</Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Doe"
                            required
                            disabled={isLoading}
                            className="h-12 rounded-xl bg-secondary/20 border-secondary/30 focus:bg-white transition-all"
                        />
                    </div>
                </div>
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
                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-tight opacity-70">Password</Label>
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
                        "Create Account"
                    )}
                </Button>
            </form>

            <div className="text-center text-sm pt-4">
                <span className="text-muted-foreground">Already a member?</span>{" "}
                <Link href={`/auth/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`} className="font-bold text-primary hover:underline underline-offset-4 decoration-2">
                    Sign in
                </Link>
            </div>

            <p className="text-center text-[10px] text-muted-foreground/60 leading-relaxed uppercase tracking-tighter">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                    Privacy Policy
                </Link>
                .
            </p>
        </div>
    );
}
