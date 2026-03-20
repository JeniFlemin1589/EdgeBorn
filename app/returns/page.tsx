"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { RotateCcw, CheckCircle, XCircle, ArrowRight, Mail } from "lucide-react";

const steps = [
    {
        step: "01",
        title: "Contact Us",
        description: "Email us at edgebornofficial@gmail.com with your order number and the reason for the return.",
    },
    {
        step: "02",
        title: "Get Approval",
        description: "Our team will review your request and send you a return confirmation within 24 hours.",
    },
    {
        step: "03",
        title: "Ship It Back",
        description: "Pack the item in its original packaging and ship it to our return address provided in the email.",
    },
    {
        step: "04",
        title: "Refund or Exchange",
        description: "Once we receive and inspect the item, your refund will be processed within 5-7 business days.",
    },
];

const eligible = [
    "Items in original, unworn condition",
    "Tags and packaging intact",
    "Returned within 14 days of delivery",
    "Proof of purchase (order number or receipt)",
];

const notEligible = [
    "Items that have been worn, washed, or altered",
    "Products without original tags",
    "Items returned after 14 days",
    "Sale or clearance items (final sale)",
    "Underwear and intimates (hygiene reasons)",
];

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                {/* Hero */}
                <section className="relative bg-[#fdfaf5] py-16 md:py-24 overflow-hidden">
                    <div className="container px-4 md:px-8 max-w-screen-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center max-w-2xl mx-auto"
                        >
                            <span className="inline-block py-1 px-4 rounded-full bg-primary/10 text-primary font-bold text-xs tracking-widest uppercase mb-4">
                                Hassle-Free
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.95]">
                                Returns <span className="text-primary">&amp; Exchanges</span>
                            </h1>
                            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                                Not satisfied? No worries. Our 14-day return policy ensures you can shop with confidence.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Steps */}
                <section className="py-16 md:py-24">
                    <div className="container px-4 md:px-8 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic text-center mb-12">How It Works</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {steps.map((item, i) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="text-center p-6 rounded-3xl border border-border/40 bg-white relative"
                                >
                                    <div className="text-4xl font-black text-primary/10 mb-2">{item.step}</div>
                                    <h3 className="font-bold text-sm uppercase tracking-tight">{item.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-2">{item.description}</p>
                                    {i < steps.length - 1 && (
                                        <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 z-10" />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Eligible / Not Eligible */}
                <section className="py-16 bg-[#fdfaf5]">
                    <div className="container px-4 md:px-8 max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="p-6 rounded-3xl border border-green-200 bg-green-50/50"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <h3 className="font-black text-sm uppercase tracking-tight text-green-800">Eligible for Returns</h3>
                                </div>
                                <ul className="space-y-3">
                                    {eligible.map((item) => (
                                        <li key={item} className="flex items-start gap-2 text-sm text-green-800/80">
                                            <CheckCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-green-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="p-6 rounded-3xl border border-red-200 bg-red-50/50"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    <h3 className="font-black text-sm uppercase tracking-tight text-red-800">Not Eligible</h3>
                                </div>
                                <ul className="space-y-3">
                                    {notEligible.map((item) => (
                                        <li key={item} className="flex items-start gap-2 text-sm text-red-800/80">
                                            <XCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-red-400" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16">
                    <div className="container px-4 md:px-8 max-w-2xl mx-auto text-center">
                        <RotateCcw className="h-10 w-10 text-primary/20 mx-auto mb-4" />
                        <h2 className="text-xl font-black tracking-tighter uppercase italic mb-2">Need to Start a Return?</h2>
                        <p className="text-muted-foreground text-sm mb-6">
                            Drop us an email with your order number and we&apos;ll take care of the rest.
                        </p>
                        <a href="mailto:edgebornofficial@gmail.com">
                            <button className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground h-12 px-8 font-bold uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:opacity-90 transition-opacity">
                                <Mail className="mr-2 h-4 w-4" /> Email Us
                            </button>
                        </a>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
