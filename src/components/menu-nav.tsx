"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Profile from "@/components/profile";

export function Navbar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex w-screen">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className="hidden font-bold sm:inline-block">
                    Skilify
                </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium justify-between">
                <Link
                    href="/"
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname === "/"
                            ? "text-foreground"
                            : "text-foreground/60"
                    )}
                >
                    Home
                </Link>

                <Link
                    href="/questions"
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname === "/questions"
                            ? "text-foreground"
                            : "text-foreground/60"
                    )}
                >
                    Questions
                </Link>
                <Link
                    href="/explore"
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname === "/explore"
                            ? "text-foreground"
                            : "text-foreground/60"
                    )}
                >
                    Explore
                </Link>
                <Link
                    href="/about"
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname === "/about"
                            ? "text-foreground"
                            : "text-foreground/60"
                    )}
                >
                    About
                </Link>
            </nav>
            <div className="flex-1 items-center space-x-2 justify-end flex">
                <Profile />
            </div>
        </div>
    );
}
