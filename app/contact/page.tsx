"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

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
                                Get in Touch
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.95]">
                                We&apos;d Love to <span className="text-primary">Hear</span> From You
                            </h1>
                            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                                Have a question, feedback, or just want to say hello? Our team is here to help you with anything you need.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Contact Info Cards + Form */}
                <section className="py-16 md:py-24">
                    <div className="container px-4 md:px-8 max-w-screen-2xl">
                        <div className="grid lg:grid-cols-5 gap-12">
                            {/* Left: Contact Info */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="lg:col-span-2 space-y-6"
                            >
                                <h2 className="text-2xl font-black tracking-tighter uppercase italic">Contact Information</h2>
                                <p className="text-muted-foreground text-sm">
                                    Reach out through any of the following channels. We typically respond within 24 hours.
                                </p>

                                <div className="space-y-5 pt-4">
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/40">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Mail className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm uppercase tracking-tight">Email</h3>
                                            <a href="mailto:edgebornofficial@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                                edgebornofficial@gmail.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/40">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Phone className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm uppercase tracking-tight">Phone</h3>
                                            <p className="text-sm text-muted-foreground">+94 77 123 4567</p>
                                            <p className="text-xs text-muted-foreground/60 mt-0.5">Mon - Sat, 9 AM to 6 PM</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/40">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm uppercase tracking-tight">Address</h3>
                                            <p className="text-sm text-muted-foreground">EdgeBorn HQ</p>
                                            <p className="text-sm text-muted-foreground">Colombo 07, Sri Lanka</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/40">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Clock className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm uppercase tracking-tight">Business Hours</h3>
                                            <p className="text-sm text-muted-foreground">Monday – Friday: 9:00 AM – 6:00 PM</p>
                                            <p className="text-sm text-muted-foreground">Saturday: 10:00 AM – 4:00 PM</p>
                                            <p className="text-sm text-muted-foreground/60">Sunday: Closed</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right: Contact Form */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="lg:col-span-3"
                            >
                                <div className="bg-white border border-border/40 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <MessageSquare className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black tracking-tighter uppercase italic">Send a Message</h2>
                                            <p className="text-xs text-muted-foreground">Fill in the form and we&apos;ll get back to you shortly.</p>
                                        </div>
                                    </div>

                                    {submitted ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center justify-center py-16 text-center"
                                        >
                                            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                                <Send className="h-7 w-7 text-green-600" />
                                            </div>
                                            <h3 className="text-xl font-bold">Message Sent!</h3>
                                            <p className="text-muted-foreground text-sm mt-2 max-w-sm">
                                                Thank you for reaching out. Our team will review your message and respond within 24 hours.
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase tracking-tight opacity-70">First Name</Label>
                                                    <Input placeholder="John" required className="h-12 rounded-xl bg-secondary/20 border-secondary/30 focus:bg-white transition-all" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase tracking-tight opacity-70">Last Name</Label>
                                                    <Input placeholder="Doe" required className="h-12 rounded-xl bg-secondary/20 border-secondary/30 focus:bg-white transition-all" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-tight opacity-70">Email Address</Label>
                                                <Input type="email" placeholder="john@example.com" required className="h-12 rounded-xl bg-secondary/20 border-secondary/30 focus:bg-white transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-tight opacity-70">Subject</Label>
                                                <Input placeholder="Order inquiry, feedback, etc." required className="h-12 rounded-xl bg-secondary/20 border-secondary/30 focus:bg-white transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-tight opacity-70">Message</Label>
                                                <Textarea placeholder="Tell us how we can help you..." required rows={5} className="rounded-xl bg-secondary/20 border-secondary/30 focus:bg-white transition-all resize-none" />
                                            </div>
                                            <Button type="submit" className="w-full h-12 rounded-xl text-md font-bold uppercase tracking-widest shadow-xl shadow-primary/20">
                                                Send Message <Send className="ml-2 h-4 w-4" />
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
