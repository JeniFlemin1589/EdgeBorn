"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });
            
            if (error) throw error;
            
            setIsSuccess(true);
            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);
        } catch (error: any) {
            console.error("Update error:", error);
            alert(error.message || "Failed to update password.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6 max-w-sm mx-auto p-4">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Create New Password</h1>
                <p className="text-sm text-muted-foreground">
                    Please enter your new secure password below.
                </p>
            </div>

            {!isSuccess ? (
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input 
                            id="password" 
                            type="password" 
                            placeholder="••••••••" 
                            required 
                            disabled={isLoading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input 
                            id="confirm-password" 
                            type="password" 
                            placeholder="••••••••" 
                            required 
                            disabled={isLoading}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            "Update Password"
                        )}
                    </Button>
                </form>
            ) : (
                <div className="text-center space-y-4 animate-fade-in">
                    <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Password Updated!</h3>
                        <p className="text-sm text-muted-foreground">
                            Your password has been changed successfully. Redirecting you to login...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
