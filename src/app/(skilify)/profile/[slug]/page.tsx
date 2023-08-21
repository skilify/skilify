"use client";
import { User } from "@/app/api/profile/[slug]/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Cross2Icon,
    Pencil2Icon,
    ReloadIcon,
    TriangleUpIcon,
} from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Noop, useForm } from "react-hook-form";
import useSWR from "swr";
import validator from "validator";
import * as z from "zod";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, function (txt: string) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

const FormSchema = z.object({
    bio: z
        .string()
        .max(100, {
            message: "Bio must not be longer than 100 characters.",
        })
        .optional()
        .refine(
            (val) =>
                validator.isAlphanumeric(val || "", "en-US", {
                    ignore: " -.#",
                }),
            {
                message: "Bio must be alphanumeric.",
            }
        ),
    tags: z
        .array(
            z
                .string()
                .max(20, { message: "Tag must be less than 20 characters." })
                .refine(
                    (val) =>
                        validator.isAlphanumeric(val || "", "en-US", {
                            ignore: " -.#",
                        }),
                    {
                        message: "Tag must be alphanumeric.",
                    }
                )
        )
        .optional(),
});

const TagInput = ({
    name,
    onBlur,
    onChange,
    value,
}: {
    onChange: (...event: any[]) => void;
    onBlur: Noop;
    value: string[] | undefined;
    name: "tags";
}) => {
    if (!value) onChange([]);
    const [input, setInput] = useState("");
    return (
        <div className="w-fit h-9 rounded-md flex border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors text-muted-foreground self-center focus-within:ring-ring focus-within:ring-1">
            <div className="h-auto w-fit flex m-auto gap-2">
                {value &&
                    value.map((tag) => (
                        <div
                            className="flex border rounded px-2 max-w-fit group"
                            key={tag}
                            onClick={() => {
                                if (value) {
                                    const newValue = [...value];
                                    newValue.splice(newValue.indexOf(tag), 1);
                                    onChange(newValue);
                                }
                            }}
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
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                    let trimmedInput = input.trim();
                    if (event.key === "Enter" && trimmedInput) {
                        const input = toTitleCase(trimmedInput);
                        setInput("");
                        if (value && !value?.find((tag) => tag === input))
                            onChange([...value, input]);
                        event.preventDefault();
                    } else if (event.key === "Backspace" && !input) {
                        if (value) {
                            const newValue = [...value];
                            newValue.pop();
                            onChange(newValue);
                        }
                    }
                }}
                placeholder="Select tags"
            />
        </div>
    );
};

export default function Profile({ params }: { params: { slug: string } }) {
    const { data: session, status } = useSession();
    const toast = useToast();
    const { data, mutate } = useSWR<{ user: User }>(
        `/api/profile/${params.slug}`,
        fetcher
    );
    const [editing, setEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const editForm = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        values: {
            bio: data?.user.bio,
            tags: data?.user.tags,
        },
    });
    useEffect(() => {
        if (data) {
            editForm.reset({
                bio: data.user.bio,
                tags: data.user.tags,
            });
        }
    }, [editing, data, editForm]);

    function onSubmit(submitData: z.infer<typeof FormSchema>) {
        setSubmitting(true);
        fetch(`/api/profile/me`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(submitData),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    editForm.setError("root", { message: res.error });
                } else {
                    mutate(
                        { user: { ...data?.user, ...submitData } } as any,
                        false
                    );
                    setEditing(false);
                }
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <div className="container">
            <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onSubmit)}>
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
                                                data.user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <Skeleton className="h-full w-full" />
                                )}
                            </div>
                            <div className="flex flex-row gap-4">
                                <h2 className="text-3xl font-bold tracking-tight">
                                    {data ? (
                                        data.user.name
                                    ) : (
                                        <Skeleton className="h-9 w-32" />
                                    )}
                                </h2>
                                {data ? (
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <Button
                                                variant="default"
                                                type="button"
                                            >
                                                Message
                                            </Button>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-fit text-sm !p-2">
                                            Coming Soon!
                                        </HoverCardContent>
                                    </HoverCard>
                                ) : (
                                    <Skeleton className="h-9 w-24" />
                                )}
                            </div>

                            <span className="text-sm flex flex-row items-center text-slate-400">
                                {data ? (
                                    <>
                                        {`${
                                            data.user.reputation || "0"
                                        } Reputation`}
                                        {session &&
                                            data &&
                                            session.user.id !==
                                                data.user.id && (
                                                <Button
                                                    variant="outline"
                                                    className="aspect-square p-0 ml-2"
                                                    type="button"
                                                    onClick={() => {
                                                        if (data) {
                                                            fetch(
                                                                `/api/profile/${data.user.id}`,
                                                                {
                                                                    method: "POST",
                                                                }
                                                            )
                                                                .then((res) =>
                                                                    res.json()
                                                                )
                                                                .then((res) => {
                                                                    if (
                                                                        res.error
                                                                    ) {
                                                                        toast.toast(
                                                                            {
                                                                                title: "Failed to upvote",
                                                                                description:
                                                                                    res.error,
                                                                            }
                                                                        );
                                                                    } else {
                                                                        mutate({
                                                                            user: {
                                                                                ...data.user,
                                                                                reputation:
                                                                                    res.reputation,
                                                                            },
                                                                        } as any);
                                                                        toast.toast(
                                                                            {
                                                                                title: "Upvoted!",
                                                                                description:
                                                                                    "You have successfully upvoted this user!",
                                                                            }
                                                                        );
                                                                    }
                                                                });
                                                        }
                                                    }}
                                                >
                                                    <TriangleUpIcon className="" />
                                                </Button>
                                            )}
                                    </>
                                ) : (
                                    <Skeleton className="h-5 w-24" />
                                )}
                            </span>
                            <span
                                className="text-sm text-slate-400 w-64"
                                onClick={() =>
                                    session &&
                                    data &&
                                    session.user.id === data.user.id &&
                                    editing === false &&
                                    setEditing(true)
                                }
                            >
                                {editing ? (
                                    <FormField
                                        control={editForm.control}
                                        name="bio"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Biography</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter your biography here!"
                                                        className="resize-none h-32"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    <>
                                        {data ? (
                                            data.user.bio || "No biography yet."
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                <Skeleton className="h-5 w-64" />
                                                <Skeleton className="h-5 w-52" />
                                            </div>
                                        )}
                                        {session &&
                                            data &&
                                            session.user.id ===
                                                data.user.id && (
                                                <Pencil2Icon className="w-3 h-3 self-center mx-2 inline-block" />
                                            )}
                                    </>
                                )}
                            </span>
                            <div
                                className="flex flex-wrap w-full mt-2 gap-2 text-muted-foreground"
                                onClick={() =>
                                    session &&
                                    data &&
                                    session.user.id === data.user.id &&
                                    editing === false &&
                                    setEditing(true)
                                }
                            >
                                {editing ? (
                                    <FormField
                                        control={editForm.control}
                                        name="tags"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tags</FormLabel>
                                                <FormControl>
                                                    <TagInput {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    <>
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
                                        {session &&
                                            data &&
                                            session.user.id ===
                                                data.user.id && (
                                                <Pencil2Icon className="w-3 h-3 self-center mx-2 inline-block" />
                                            )}
                                    </>
                                )}
                            </div>
                            <span className="text-muted-foreground">
                                {data ? (
                                    <span className="font-bold">
                                        Discord:{" "}
                                        <span className="font-normal">
                                            {data.user.name}
                                        </span>
                                    </span>
                                ) : (
                                    <Skeleton className="h-5 w-32"></Skeleton>
                                )}
                            </span>
                            <p className="text-[0.8rem] font-medium text-destructive">
                                {editForm.formState.errors.root?.message}
                            </p>
                            {editing && (
                                <div className="flex flex-row gap-2">
                                    <Button
                                        type="reset"
                                        variant="secondary"
                                        onClick={() => setEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="default"
                                        disabled={submitting}
                                    >
                                        {submitting && (
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        {submitting ? "Saving..." : "Save"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
