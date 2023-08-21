"use client";
import { Answer, Question } from "@/app/api/questions/[slug]/route";
import { Comment } from "@/components/comment";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
    DialogHeader,
    DialogFooter,
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatBubbleIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import Error from "next/error";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import router, { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

const fetcher = (url: string) =>
    fetch(url).then(async (res) => (await res.json()).question);

const formSchema = z.object({
    content: z
        .string()
        .min(4, {
            message: "Content must be at least 4 characters.",
        })
        .max(500, {
            message: "Content must be less than 500 characters.",
        }),
});

export default function Page({ params }: { params: { slug: string } }) {
    const router = useRouter();
    const { data, isLoading, isValidating, error, mutate } = useSWR<Question>(
        `/api/questions/${params.slug}`,
        fetcher
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const [submitting, setSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if (!submitting) {
            form.reset({ content: "" });
            setIsOpen(false);
        }
    }, [submitting, form]);
    function onSubmit(values: z.infer<typeof formSchema>) {
        setSubmitting(true);
        // src/app/(skilify)/profile/[slug]/page.tsx:152:4 for example
        fetch(`/api/questions/${params.slug}/answer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((response: Response) => {
                if (response && response.status == 200) {
                    mutate();
                    toast({
                        variant: "default",
                        title: "Question Answered! Thanks!",
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "An error occured! Please try again later.",
                    });
                }
            })
            .finally(() => setSubmitting(false));
    }

    //   console.log(data);
    return (
        <>
            <div className="container mt-10">
                <div className="flex flex-row">
                    {isLoading ? (
                        <Skeleton className="w-full h-10"></Skeleton>
                    ) : data && data.title ? (
                        <h1 className="text-4xl">
                            <b>{data.title}</b>
                        </h1>
                    ) : (
                        <Error statusCode={404}></Error>
                    )}
                </div>

                <div className="mt-6">
                    <div className="flex flex-row gap-2 mt-13">
                        {isLoading ? (
                            <Skeleton className="inline w-20 h-10" />
                        ) : (
                            <>
                                <div className="rounded-full overflow-clip h-10 w-10">
                                    <Avatar className="h-10 w-10 rounded-full overflow-clip">
                                        <AvatarImage
                                            src={data?.author.image}
                                            alt={data?.author.name}
                                        />
                                        <AvatarFallback className="font-sans">
                                            {data?.author.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <span className="text-md text-gray-300">
                                    {data?.author.name}
                                </span>
                            </>
                        )}
                    </div>
                </div>
                <div className="mt-2">
                    <span className="text-sm text-gray-400">
                        {isLoading ? (
                            <Skeleton className="inline w-20 h-10" />
                        ) : data ? (
                            new Date(data?.timestamp).toLocaleDateString(
                                navigator.language,
                                {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                }
                            ) +
                            " at " +
                            new Date(data?.timestamp).toLocaleTimeString(
                                navigator.language
                            )
                        ) : (
                            ""
                        )}
                    </span>
                </div>
                <div className="mt-10">
                    {isLoading ? (
                        <Skeleton className="w-auto h-36"></Skeleton>
                    ) : data ? (
                        <p className="text-lg">{data.content}</p>
                    ) : (
                        ""
                    )}
                </div>

                <div className="flex flex-col gap-2 mt-40">
                    {isLoading ? (
                        <Skeleton className="w-auto h-36"></Skeleton>
                    ) : (
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <ChatBubbleIcon className="w-4 h-4 mr-2" />
                                    Answer Question
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Answer</DialogTitle>
                                    <DialogDescription>
                                        Be nice!
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-2"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="content"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Content
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Explain in detail..."
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <DialogFooter>
                                            <Button
                                                type="submit"
                                                className="mt-2"
                                                disabled={submitting}
                                            >
                                                {submitting && (
                                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                )}
                                                {submitting
                                                    ? "Answering..."
                                                    : "Answer"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    )}

                    {isLoading ? (
                        <Skeleton className="w-1 h-1"></Skeleton>
                    ) : data && data.answers.length > 0 ? (
                        data.answers.map((a: Answer, index: number) => {
                            return <Comment props={a} key={index} />;
                        })
                    ) : (
                        <Card>
                            <CardHeader>
                                No Answers Yet, Be the first!!!!!
                            </CardHeader>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
