"use client";
import { User } from "@/app/api/profile/[slug]/route";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    Cross2Icon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";
import Tilt from "react-parallax-tilt";
import useSWRInfinite from "swr/infinite";
import { useDebounce } from "use-debounce";

const fetcher = (url: string) =>
    fetch(url).then(async (res) => (await res.json()).users);

const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, function (txt: string) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

export default function Explore() {
    const [searchName, setSearchName] = useState("");
    const [searchDebounce] = useDebounce(searchName, 750);
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const getKey = (pageIndex: number, previousPageData: any) => {
        if (previousPageData && !previousPageData.length) return null;

        const search: string[] = [];
        if (searchDebounce) search.push(`name=${searchDebounce}`);
        if (tags.length) search.push(`tags=${tags.join(",")}`);

        if (pageIndex === 0)
            return `/api/explore/get${search && `?${search.join("&")}`}`;
        return `/api/explore/get?cursor=${
            previousPageData[previousPageData.length - 1].id
        }${search && `&${search.join("&")}`}`;
    };
    const {
        data: users,
        size,
        setSize,
        isLoading,
        isValidating,
    } = useSWRInfinite(getKey, fetcher, { initialSize: 1 });

    const [page, setPage] = useState(0);

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
                        <Input
                            className="w-64"
                            placeholder="Search users"
                            value={searchName}
                            onChange={(event) =>
                                setSearchName(event.target.value)
                            }
                        />
                        <div className="w-fit h-9 rounded-md flex border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors text-muted-foreground self-center focus-within:ring-ring focus-within:ring-1">
                            <div className="h-auto w-fit flex m-auto gap-2">
                                {tags.map((tag) => (
                                    <div
                                        className="flex border rounded px-2 max-w-fit group"
                                        key={tag}
                                        onClick={() =>
                                            setTags((tags) =>
                                                tags.filter((t) => t !== tag)
                                            )
                                        }
                                    >
                                        <div className="w-2 h-2 self-center rounded-full bg-blue-900 mr-2 group-hover:hidden" />
                                        <Cross2Icon className="w-2 h-2 self-center text-zinc-500 mr-2 group-hover:block hidden" />
                                        <span className="text-sm font-sans whitespace-nowrap">
                                            {tag}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <input
                                className="bg-transparent focus-visible:outline-none ml-2 w-24"
                                value={tagInput}
                                onChange={(event) =>
                                    setTagInput(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    let trimmedInput = tagInput.trim();
                                    if (event.key === "Enter" && trimmedInput) {
                                        const input = toTitleCase(trimmedInput);
                                        setTagInput("");
                                        if (!tags.includes(input))
                                            setTags((tags) => [...tags, input]);
                                    } else if (
                                        event.key === "Backspace" &&
                                        !tagInput
                                    ) {
                                        setTags((tags) =>
                                            tags.slice(0, tags.length - 1)
                                        );
                                    }
                                }}
                                placeholder="Select tags"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center py-4">
                        {isLoading ? (
                            [...Array(12)].map((_, index) => (
                                <Skeleton className="w-72 h-44" key={index} />
                            ))
                        ) : users && users[page] && users[page].length > 0 ? (
                            users[page].map((user: User, index: number) => (
                                <Tilt
                                    key={index}
                                    transitionSpeed={500}
                                    tiltMaxAngleX={16}
                                    tiltMaxAngleY={16}
                                    scale={1.07}
                                    tiltReverse
                                    glareEnable
                                    glareBorderRadius="0.75rem"
                                    glareMaxOpacity={0.17}
                                >
                                    <Link href={`/profile/${user.id}`}>
                                        <Card className="w-72 h-48">
                                            <CardHeader className="pb-2">
                                                <CardTitle>
                                                    <div className="relative h-10 w-10 rounded-full overflow-clip mb-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage
                                                                src={user.image}
                                                                alt={user.name}
                                                            />
                                                            <AvatarFallback className="font-sans">
                                                                {user.name
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </div>
                                                    {user.name}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="font-sans text-slate-400 text-sm pb-2">
                                                {user.bio || "No bio provided."}
                                                <div className="relative">
                                                    <div className="absolute top-0 left-0 w-full h-full z-10 bg-gradient-to-r from-transparent from-80% to-card"></div>
                                                    <div className="flex flex-row overflow-hidden mt-2 gap-2">
                                                        {user.tags.map(
                                                            (tag) => (
                                                                <div
                                                                    className="flex border rounded px-2 max-w-fit"
                                                                    key={tag}
                                                                >
                                                                    <div className="w-2 h-2 self-center rounded-full bg-blue-900 mr-2" />
                                                                    <span className="whitespace-nowrap">
                                                                        {tag}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="pt-0 text-xs font-sans text-muted-foreground">
                                                {user.reputation || 0}{" "}
                                                Reputation
                                            </CardFooter>
                                        </Card>
                                    </Link>
                                </Tilt>
                            ))
                        ) : (
                            <div className="flex flex-row h-44 text-center">
                                <span className="font-semibold text-lg w-full h-full text-muted-foreground">
                                    Theres nothing here
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-row w-full justify-center">
                        <Button
                            variant="ghost"
                            className="aspect-square p-0"
                            onClick={() => {
                                setPage(Math.max(0, page - 1));
                            }}
                        >
                            <ChevronLeftIcon className="w-4 h-4 m-0" />
                        </Button>
                        <div className="flex flex-row items-center justify-center">
                            <span className="text-sm">Page {page + 1}</span>
                        </div>

                        <Button
                            variant="ghost"
                            className="aspect-square p-0"
                            onClick={() => {
                                setPage(page + 1);
                                if (page + 1 >= size) {
                                    setSize(size + 1);
                                }
                            }}
                        >
                            <ChevronRightIcon className="w-4 h-4 m-0" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
