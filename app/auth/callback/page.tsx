"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const code = searchParams.get("code");

                if (code) {
                    // PKCE flow: exchange the code for a session
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) {
                        console.error("Code exchange error:", error);
                        router.push("/auth/login?error=callback_failed");
                        return;
                    }
                }

                // Check if session exists (handles both code exchange and hash fragment flows)
                const { data, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error("Session error:", sessionError);
                    router.push("/auth/login?error=callback_failed");
                    return;
                }

                if (data.session) {
                    router.push("/");
                } else {
                    router.push("/auth/login");
                }
            } catch (err) {
                console.error("Callback error:", err);
                router.push("/auth/login?error=callback_failed");
            }
        };

        handleCallback();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Signing you in...
            </p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Signing you in...
                </p>
            </div>
        }>
            <CallbackHandler />
        </Suspense>
    );
}
