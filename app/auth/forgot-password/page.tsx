"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState("");

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });
            if (error) throw error;
            setIsSubmitted(true);
        } catch (error: any) {
            console.error("Reset error:", error);
            alert(error.message || "Failed to send reset link.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <Link href="/auth/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Forgot Password?</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email and we'll send you a recovery link
                </p>
            </div>

            {!isSubmitted ? (
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="m@example.com" 
                            required 
                            disabled={isLoading} 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            "Send Recovery Link"
                        )}
                    </Button>
                </form>
            ) : (
                <div className="text-center space-y-4 animate-fade-in">
                    <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Check your email</h3>
                        <p className="text-sm text-muted-foreground">
                            We have sent a password recovery link to your email.
                        </p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
                        Try another email
                    </Button>
                </div>
            )}
        </div>
    );
}
