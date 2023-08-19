"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { ProfileWrapper } from "@/components/data-provider";

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
                <ProfileWrapper>
                    <body className={`${inter.variable} font-sans`}>
                        {children}
                    </body>
                </ProfileWrapper>
            </SessionProvider>
        </html>
    );
}
