"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuGroup,
    DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { useContext } from "react";
import { ProfileContext } from "./data-provider";
import Link from "next/link";

export default function Profile() {
    const { data: session } = useSession();
    const router = useRouter();
    const profile = useContext(ProfileContext);

    if (session && session.user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full"
                    >
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={session.user.image!}
                                alt={session.user.name!}
                            />
                            <AvatarFallback className="font-sans">
                                {session.user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60" align="end" forceMount>
                    <DropdownMenuArrow />
                    <DropdownMenuLabel className="font-normal m-2">
                        <div className="flex flex-col space-y-1">
                            <p className="text-base font-medium leading-none">
                                {session.user.name}
                            </p>
                            <p className="text-sm leading-none text-muted-foreground">
                                {session.user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="m-2">
                        <Link
                            href={
                                profile ? `/profile/${profile.id}` : "/explore"
                            }
                        >
                            <DropdownMenuItem className="cursor-pointer">
                                Profile
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="m-2 cursor-pointer"
                        onClick={() => signOut()}
                    >
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    } else {
        return (
            <Button
                variant="outline"
                onClick={() => {
                    signIn("discord");
                }}
            >
                Sign In
            </Button>
        );
    }
}
