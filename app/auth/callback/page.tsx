"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Supabase automatically picks up the tokens from the URL hash
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("Auth callback error:", error);
                    router.push("/auth/login?error=callback_failed");
                    return;
                }

                if (data.session) {
                    // Successfully authenticated — redirect to home
                    router.push("/");
                } else {
                    // No session found — redirect to login
                    router.push("/auth/login");
                }
            } catch (err) {
                console.error("Callback error:", err);
                router.push("/auth/login?error=callback_failed");
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Signing you in...
            </p>
        </div>
    );
}
