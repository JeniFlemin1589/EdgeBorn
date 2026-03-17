"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileHeader } from "@/components/admin/AdminMobileHeader";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, profile, isLoading } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            if (user && profile?.is_admin) {
                setIsAuthorized(true);
            } else {
                router.push("/");
            }
            setIsChecking(false);
        }
    }, [user, profile, isLoading, router]);

    if (isLoading || isChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-zinc-400 animate-pulse">Verifying Credentials...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    // Don't show sidebar on login page
    if (pathname === "/admin/login") {
        return <div className="min-h-screen bg-zinc-950 flex flex-col">{children}</div>;
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row">
            <AdminSidebar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 md:pl-0 w-full">
                <AdminMobileHeader />
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
