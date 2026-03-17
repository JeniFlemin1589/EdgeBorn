import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* Left Side: Brand Imagery */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-primary">
                <Image
                    src="/images/auth/login-bg.jpg"
                    alt="EdgeBorn Brand Image"
                    fill
                    className="object-cover transition-transform duration-10000 hover:scale-110"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute inset-0 flex flex-col items-start justify-between p-12 text-white z-10">
                    <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter hover:opacity-80 transition-opacity">
                        <div className="bg-primary p-1.5 rounded-lg border border-white/20">
                            <div className="bg-white h-4 w-4 rounded-sm" />
                        </div>
                        EDGEBORN
                    </Link>

                    <div className="space-y-6 max-w-lg">
                        <h2 className="text-5xl font-black tracking-tighter leading-none italic uppercase">
                            Redefine <br />Your <span className="text-secondary">Identity.</span>
                        </h2>
                        <p className="text-lg text-white/70 italic leading-relaxed">
                            "Fashion is the armor to survive the reality of everyday life."
                        </p>
                    </div>

                    <div className="text-sm font-medium tracking-widest uppercase text-white/50">
                        EST. 2026 | Premium High-Street Apparel
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 bg-[#fdfaf5]">
                <div className="w-full max-w-md space-y-6">
                    {/* Mobile Logo Only */}
                    <div className="lg:hidden flex justify-center mb-4">
                        <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter">
                            <div className="bg-primary p-1.5 rounded-lg">
                                <div className="bg-white h-4 w-4 rounded-sm" />
                            </div>
                            EDGEBORN
                        </Link>
                    </div>

                    <div className="bg-white p-5 md:p-8 rounded-3xl shadow-2xl shadow-primary/10 border border-secondary/20">
                        {children}
                    </div>

                    <div className="text-center text-xs text-muted-foreground/60 tracking-widest uppercase pt-4">
                        &copy; 2026 EdgeBorn Collection. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}
