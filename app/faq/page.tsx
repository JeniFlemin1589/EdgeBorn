"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqData = [
    {
        category: "Orders & Shipping",
        questions: [
            {
                q: "How long does shipping take?",
                a: "Standard shipping within Sri Lanka takes 3-5 business days. Express delivery is available for Colombo and suburbs with next-day delivery options."
            },
            {
                q: "Do you ship internationally?",
                a: "Currently, we only ship within Sri Lanka. We are working on expanding to international markets soon. Stay tuned for updates!"
            },
            {
                q: "How can I track my order?",
                a: "Once your order is shipped, you will receive a tracking number via email. You can also check your order status in your Account Dashboard under 'Order History'."
            },
            {
                q: "Can I change or cancel my order?",
                a: "You can modify or cancel your order within 2 hours of placing it. After that, the order enters processing and cannot be changed. Please contact us immediately if you need assistance."
            },
        ]
    },
    {
        category: "Returns & Exchanges",
        questions: [
            {
                q: "What is your return policy?",
                a: "We accept returns within 14 days of delivery. Items must be unworn, unwashed, and in their original packaging with tags attached."
            },
            {
                q: "How do I initiate a return?",
                a: "Email us at edgebornofficial@gmail.com with your order number and reason for return. Our team will guide you through the process and provide a return shipping label."
            },
            {
                q: "Do you offer exchanges?",
                a: "Yes! If you need a different size or color, we offer free exchanges. Simply contact us within 14 days of receiving your order."
            },
        ]
    },
    {
        category: "Products & Sizing",
        questions: [
            {
                q: "How do I find my size?",
                a: "Each product page includes a detailed size chart. We recommend measuring yourself and comparing with our chart for the best fit. If you're between sizes, we suggest going one size up."
            },
            {
                q: "Are your products true to size?",
                a: "Our apparel follows standard Sri Lankan sizing. Most customers find our sizing accurate. Check individual product reviews for additional fit feedback from other customers."
            },
            {
                q: "What materials do you use?",
                a: "We use premium 100% combed cotton for most of our t-shirts, ensuring softness and durability. Our hoodies feature a cotton-polyester blend for extra warmth and structure."
            },
        ]
    },
    {
        category: "Payment & Security",
        questions: [
            {
                q: "What payment methods do you accept?",
                a: "We accept Cash on Delivery (COD), bank transfers, and major credit/debit cards. All online transactions are secured with SSL encryption."
            },
            {
                q: "Is my payment information secure?",
                a: "Absolutely. We use industry-standard encryption and never store your full payment details on our servers. Your security is our top priority."
            },
        ]
    },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-border/40 rounded-2xl overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/20 transition-colors"
            >
                <span className="font-bold text-sm pr-4">{question}</span>
                <ChevronDown className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="px-5 pb-5"
                >
                    <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
                </motion.div>
            )}
        </div>
    );
}

export default function FAQPage() {
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
                                Help Center
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.95]">
                                Frequently Asked <span className="text-primary">Questions</span>
                            </h1>
                            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                                Find answers to common questions about orders, shipping, returns, and more.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* FAQ Sections */}
                <section className="py-16 md:py-24">
                    <div className="container px-4 md:px-8 max-w-3xl mx-auto">
                        {faqData.map((section, i) => (
                            <motion.div
                                key={section.category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="mb-12"
                            >
                                <h2 className="text-xl font-black tracking-tighter uppercase italic mb-4">{section.category}</h2>
                                <div className="space-y-3">
                                    {section.questions.map((item) => (
                                        <FAQItem key={item.q} question={item.q} answer={item.a} />
                                    ))}
                                </div>
                            </motion.div>
                        ))}

                        <div className="text-center pt-8 border-t">
                            <p className="text-muted-foreground text-sm mb-4">Still have questions?</p>
                            <a href="/contact">
                                <button className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground h-12 px-8 font-bold uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:opacity-90 transition-opacity">
                                    Contact Us
                                </button>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
