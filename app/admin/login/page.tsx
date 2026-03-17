"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/auth/login?redirect=/admin");
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-zinc-400 animate-pulse font-medium">Redirecting to Secure Login...</p>
            </div>
        </div>
    );
}
