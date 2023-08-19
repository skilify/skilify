"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Profile({ params }: { params: { slug: string } }) {
    const { data, error } = useSWR(`/api/profile/${params.slug}`, fetcher);

    return (
        <div className="container">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex flex-col items-start justify-between space-y-2">
                    <div className="relative h-32 w-32 rounded-full overflow-clip mb-2">
                        <Avatar className="h-full w-full">
                            <AvatarImage
                                src={data && data.user.image}
                                alt={data && data.user.name}
                            />
                            <AvatarFallback className="font-sans">
                                {data && data.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {data && data.user.name}
                    </h2>
                    <span className="text-sm text-slate-400">
                        {(data && data.user.bio) || "No biography."}
                    </span>
                </div>
            </div>
        </div>
    );
}
