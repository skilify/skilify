"use client";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <SessionProvider>
                <body className={`${inter.variable} font-sans`}>
                    {children}
                    <Toaster />
                </body>
            </SessionProvider>
        </html>
    );
}
