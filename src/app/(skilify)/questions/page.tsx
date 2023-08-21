"use client";
import { QuestionCard } from "@/components/question-card";
import useSWRInfinite from "swr/infinite";
import { Question } from "@/app/api/questions/[slug]/route";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import * as z from "zod";
import validator from "validator";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
    FormControl,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

const fetcher = (url: string) =>
    fetch(url).then(async (res) => (await res.json()).questions);

const formSchema = z.object({
    title: z
        .string()
        .min(4, {
            message: "Title must be at least 4 characters.",
        })
        .max(80, { message: "Title must be less than 80 characters." }),

    content: z
        .string()
        .min(4, {
            message: "Content must be at least 4 characters.",
        })
        .max(500, {
            message: "Content must be less than 500 characters.",
        }),
});

export default function Question() {
    const router = useRouter();
    const { toast } = useToast();
    const [searchName, setSearchName] = useState("");
    const [searchDebounce] = useDebounce(searchName, 750);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const [submitting, setSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if (!submitting) {
            form.reset({ title: "", content: "" });
            setIsOpen(false);
        }
    }, [submitting, form]);
    function onSubmit(values: z.infer<typeof formSchema>) {
        setSubmitting(true);
        fetch(`/api/questions/post`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then(async (response: Response) => {
                if (response && response.status == 200) {
                    const json = await response.json();
                    router.push("/questions/" + json.id);
                } else {
                    toast({
                        variant: "destructive",
                        title: "An error occured! Please try again later.",
                    });
                }
            })
            .finally(() => setSubmitting(false));
    }

    const getKey = (pageIndex: number, previousPageData: any) => {
        if (previousPageData && !previousPageData.length) return null;

        const search: string[] = [];
        if (searchDebounce) search.push(`title=${searchDebounce}`);

        if (pageIndex === 0)
            return `/api/questions/get${search && `?${search.join("&")}`}`;
        return `/api/questions/get?cursor=${
            previousPageData[previousPageData.length - 1].id
        }${search && `&${search.join("&")}`}`;
    };

    const { data, size, setSize, isLoading, isValidating } = useSWRInfinite<
        Question[]
    >(getKey, fetcher, { initialSize: 1 });

    useEffect(() => {
        setSize(1);
    }, [searchDebounce, setSize]);

    return (
        <div className="container">
            <div className="grid grid-cols-1  gap-4 mt-10">
                <h2 className="text-3xl font-bold tracking-tight">Questions</h2>
                <span className="text-sm text-slate-400">
                    View and answer questions from peers.
                </span>
                <div className="flex flex-row w-full justify-between">
                    <Input
                        className="w-64"
                        placeholder="Search questions"
                        value={searchName}
                        onChange={(event) => setSearchName(event.target.value)}
                    />
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Ask Question
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Ask a question</DialogTitle>
                                <DialogDescription>
                                    What do you need help with?
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-2"
                                >
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Post Title"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Question</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="What's your question?"
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
                                                ? "Asking..."
                                                : "Ask question"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-7 mt-10">
                {isLoading ? (
                    [...Array(16)].map((_, index) => (
                        <Skeleton className="w-auto h-28" key={index} />
                    ))
                ) : data &&
                  data.length > 0 &&
                  data.reduce((acc, cv) => acc + cv.length, 0) > 0 ? (
                    <>
                        {data.map((page, pageIndex) =>
                            page.map((question: Question, index: number) => (
                                <QuestionCard
                                    title={question.title}
                                    content={question.content}
                                    id={question.id}
                                    key={`${question.id}-${index}`}
                                ></QuestionCard>
                            ))
                        )}
                        <Button
                            onClick={() => setSize(size + 1)}
                            disabled={isLoading || isValidating}
                        >
                            {(isLoading || isValidating) && (
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Load More
                        </Button>
                    </>
                ) : (
                    <div className="flex flex-row h-44 text-center">
                        <span className="font-semibold text-lg w-full h-full text-muted-foreground">
                            Theres nothing here
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
