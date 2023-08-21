"use client";
import Profile from "@/components/profile";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ViewVerticalIcon } from "@radix-ui/react-icons";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

export function MobileNav() {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="grid grid-cols-3 w-screen md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild className="justify-start">
                    <Button
                        variant="ghost"
                        className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                    >
                        <ViewVerticalIcon className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0">
                    <MobileLink
                        href="/"
                        className="flex items-center"
                        onOpenChange={setOpen}
                    >
                        <span className="font-bold">Skilify</span>
                    </MobileLink>
                    <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                        <div className="flex flex-col space-y-3">
                            <MobileLink key="/" href="/" onOpenChange={setOpen}>
                                Home
                            </MobileLink>
                            <MobileLink
                                key="/questions"
                                href="/questions"
                                onOpenChange={setOpen}
                            >
                                Questions
                            </MobileLink>
                            <MobileLink
                                key="/explore"
                                href="/explore"
                                onOpenChange={setOpen}
                            >
                                Explore
                            </MobileLink>
                            <MobileLink
                                key="/about"
                                href="/about"
                                onOpenChange={setOpen}
                            >
                                About
                            </MobileLink>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
            <MobileLink
                href="/"
                className="items-center space-x-2 flex justify-center"
                onOpenChange={setOpen}
            >
                <span className="inline-block font-bold ">Skilify</span>
            </MobileLink>

            <div className="flex-1 items-center space-x-2 justify-end flex">
                <Profile />
            </div>
        </div>
    );
}

interface MobileLinkProps extends LinkProps {
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
    className?: string;
}

function MobileLink({
    href,
    onOpenChange,
    className,
    children,
    ...props
}: MobileLinkProps) {
    const router = useRouter();
    return (
        <Link
            href={href}
            onClick={() => {
                router.push(href.toString());
                onOpenChange?.(false);
            }}
            className={cn(className)}
            {...props}
        >
            {children}
        </Link>
    );
}
