"use client";
import { User } from "@/app/api/profile/[slug]/route";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Profile({ params }: { params: { slug: string } }) {
    const { data, error } = useSWR<{ user: User }>(
        `/api/profile/${params.slug}`,
        fetcher
    );

    return (
        <div className="container">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex flex-col items-start justify-between space-y-2 w-72">
                    <div className="relative h-32 w-32 rounded-full overflow-clip mb-2">
                        {data ? (
                            <Avatar className="h-full w-full">
                                <AvatarImage
                                    src={data && data.user.image}
                                    alt={data && data.user.name}
                                />
                                <AvatarFallback className="font-sans">
                                    {data &&
                                        data.user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        ) : (
                            <Skeleton className="h-full w-full" />
                        )}
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {data ? (
                            data.user.name
                        ) : (
                            <Skeleton className="h-9 w-32" />
                        )}
                    </h2>
                    <span className="text-sm text-slate-400">
                        {data ? (
                            `${data.user.reputation || "0"} Reputation`
                        ) : (
                            <Skeleton className="h-5 w-24" />
                        )}
                    </span>
                    <span className="text-sm text-slate-400">
                        {data ? (
                            data.user.bio || "No biography yet."
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-5 w-64" />
                                <Skeleton className="h-5 w-52" />
                            </div>
                        )}
                    </span>
                    <div className="flex flex-wrap w-full mt-2 gap-2 text-muted-foreground">
                        {data ? (
                            data.user.tags.map((tag) => (
                                <div
                                    className="flex border rounded px-2 max-w-fit"
                                    key={tag}
                                >
                                    <div className="w-2 h-2 self-center rounded-full bg-blue-900 mr-2" />
                                    <span>{tag}</span>
                                </div>
                            ))
                        ) : (
                            <Skeleton className="h-6 w-36" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
