"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function Explore() {
    const { data: session } = useSession();

    return (
        <div className="container">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex flex-col items-start justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Explore
                    </h2>
                    <span className="text-sm text-slate-400">
                        Find users to exchange skills with.
                    </span>
                    <div className="flex flex-row gap-4">
                        <Input className="w-64" placeholder="Search users" />
                        <Popover>
                            <PopoverTrigger>
                                <div className="h-9 rounded-md flex border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors">
                                    <span className="text-muted-foreground self-center">
                                        Select tags
                                    </span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 flex flex-wrap justify-center gap-2 text-muted-foreground">
                                <div className="flex border rounded px-2 max-w-fit basis-1/3">
                                    <div className="w-2 h-2 self-center rounded-full bg-blue-900 mr-2" />
                                    <span>Math</span>
                                </div>
                                <div className="flex border rounded px-2 max-w-fit basis-1/3">
                                    <div className="w-2 h-2 self-center rounded-full bg-green-900 mr-2" />
                                    <span>Science</span>
                                </div>
                                <div className="flex border rounded px-2 max-w-fit basis-1/3">
                                    <div className="w-2 h-2 self-center rounded-full bg-green-900 mr-2" />
                                    <span>Programming</span>
                                </div>
                                <div className="flex border rounded px-2 max-w-fit basis-1/3">
                                    <div className="w-2 h-2 self-center rounded-full bg-green-900 mr-2" />
                                    <span>SpaceX</span>
                                </div>
                                <div className="flex border rounded px-2 max-w-fit basis-1/3">
                                    <div className="w-2 h-2 self-center rounded-full bg-green-900 mr-2" />
                                    <span>Teaching</span>
                                </div>
                                <div className="flex border rounded px-2 max-w-fit basis-1/3">
                                    <div className="w-2 h-2 self-center rounded-full bg-green-900 mr-2" />
                                    <span>Tutoring</span>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center py-4">
                        {[...Array(12)].map((_, index) => (
                            <Card className="w-72 h-44" key={index}>
                                <CardHeader className="pb-2">
                                    <CardTitle>
                                        <div className="relative h-10 w-10 rounded-full overflow-clip mb-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={session?.user?.image!}
                                                    alt={session?.user?.name!}
                                                />
                                                <AvatarFallback className="font-sans">
                                                    {session &&
                                                        session.user &&
                                                        session.user.email
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        sixfalls
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="font-sans text-slate-400 text-sm">
                                    Student at Fremont High School
                                    <div className="relative">
                                        <div className="absolute top-0 left-0 w-full h-full z-10 bg-gradient-to-r from-transparent from-80% to-card"></div>
                                        <div className="flex flex-row overflow-hidden mt-2 gap-2">
                                            <div className="flex border rounded px-2 max-w-fit">
                                                <div className="w-2 h-2 self-center rounded-full bg-blue-900 mr-2" />
                                                <span>Math</span>
                                            </div>
                                            <div className="flex border rounded px-2 max-w-fit">
                                                <div className="w-2 h-2 self-center rounded-full bg-green-900 mr-2" />
                                                <span>Science</span>
                                            </div>
                                            <div className="flex border rounded px-2 max-w-fit">
                                                <div className="w-2 h-2 self-center rounded-full bg-green-900 mr-2" />
                                                <span>Programming</span>
                                            </div>
                                            <div className="flex border rounded px-2 max-w-fit">
                                                <div className="w-2 h-2 self-center rounded-full bg-green-900 mr-2" />
                                                <span>SpaceX</span>
                                            </div>
                                            <div className="flex border rounded px-2 max-w-fit">
                                                <div className="w-2 h-2 self-center rounded-full bg-green-900 mr-2" />
                                                <span>Teaching</span>
                                            </div>
                                            <div className="flex border rounded px-2 max-w-fit">
                                                <div className="w-2 h-2 self-center rounded-full bg-green-900 mr-2" />
                                                <span>Tutoring</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="flex flex-row w-full justify-center">
                        <Button variant="ghost" className="aspect-square p-0">
                            <ChevronLeftIcon className="w-4 h-4 m-0" />
                        </Button>
                        <div className="flex flex-row items-center justify-center">
                            <Input className="text-center px-0 w-8" value={1} />
                            <span className="text-sm">/99</span>
                        </div>

                        <Button variant="ghost" className="aspect-square p-0">
                            <ChevronRightIcon className="w-4 h-4 m-0" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
