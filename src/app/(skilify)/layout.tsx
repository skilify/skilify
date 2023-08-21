import { SiteFooter } from "@/components/footer";
import { Navbar } from "@/components/menu-nav";
import { MobileNav } from "@/components/mobile-nav";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <div
            className="min-h-screen relative flex flex-col"
            style={{
                backgroundImage:
                    "linear-gradient(40deg, rgba(52, 97, 235, 0.2) 0%, rgba(85, 112, 125, 0) 50%), linear-gradient(140deg, rgba(85, 104, 125, 0) 50%, rgba(52, 217, 235, 0.2) 100%)",
            }}
        >
            <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
                <div className="container flex h-20 items-center">
                    <Navbar />
                    <MobileNav />
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <SiteFooter />
        </div>
    );
}
