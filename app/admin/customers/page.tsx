"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, RefreshCw, Loader2, ShieldCheck, ShieldAlert } from "lucide-react";

type Profile = {
    id: string;
    email: string;
    full_name: string;
    is_admin: boolean;
    created_at: string;
};

export default function AdminCustomersPage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfiles = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from("profiles")
                .select("*")
                .order("created_at", { ascending: false });

            if (fetchError) throw fetchError;
            setProfiles(data || []);
        } catch (err) {
            console.error("Error fetching profiles:", err);
            setError("Failed to load customers.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const toggleAdmin = async (id: string, currentStatus: boolean) => {
        try {
            const { error: updateError } = await supabase
                .from("profiles")
                .update({ is_admin: !currentStatus })
                .eq("id", id);

            if (updateError) throw updateError;

            setProfiles(prev => prev.map(p =>
                p.id === id ? { ...p, is_admin: !currentStatus } : p
            ));
        } catch (err) {
            console.error("Error toggling admin status:", err);
            alert("Failed to update admin status.");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight uppercase italic tracking-tighter">Customers</h2>
                    <p className="text-muted-foreground text-sm">Manage your user base and permissions.</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchProfiles}
                    disabled={isLoading}
                    className="rounded-xl border-2 uppercase font-bold tracking-widest text-xs h-9"
                >
                    <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-xl border-2 border-destructive/20 font-bold text-center">
                    {error}
                </div>
            )}

            <div className="border-2 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-secondary/20">
                        <TableRow>
                            <TableHead className="uppercase font-black text-xs tracking-widest">Customer</TableHead>
                            <TableHead className="uppercase font-black text-xs tracking-widest">Status</TableHead>
                            <TableHead className="uppercase font-black text-xs tracking-widest">Joined</TableHead>
                            <TableHead className="text-right uppercase font-black text-xs tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-48 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <p className="text-xs uppercase font-bold tracking-widest opacity-50">Loading Users...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : profiles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-48 text-center">
                                    <p className="text-muted-foreground font-bold italic">No customers found.</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            profiles.map((profile) => (
                                <TableRow key={profile.id} className="hover:bg-primary/5 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black italic border-2 border-primary/20">
                                                {profile.full_name?.substring(0, 2).toUpperCase() || "EF"}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold uppercase tracking-tight text-sm">
                                                    {profile.full_name || "N/A"}
                                                </span>
                                                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                                    <Mail className="h-3 w-3" /> {profile.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {profile.is_admin ? (
                                            <Badge className="bg-primary/10 text-primary border-primary/30 rounded-lg px-2 py-0.5 text-[10px] uppercase font-black tracking-widest flex items-center gap-1 w-fit">
                                                <ShieldCheck className="h-3 w-3" /> Administrator
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="rounded-lg px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest text-muted-foreground w-fit">
                                                Customer
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-xs font-bold text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {profile.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : "N/A"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleAdmin(profile.id, profile.is_admin)}
                                            className={`rounded-lg h-9 w-9 p-0 hover:bg-primary/10 ${profile.is_admin ? 'text-destructive' : 'text-primary'}`}
                                            title={profile.is_admin ? "Revoke Admin Access" : "Grant Admin Access"}
                                        >
                                            {profile.is_admin ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
