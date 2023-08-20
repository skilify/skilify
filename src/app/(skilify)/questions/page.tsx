"use client";
import { QuestionCard } from "@/components/ui/question-card";
import useSWR from "swr";
import { Question } from "@/app/api/questions/[slug]/route";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "@radix-ui/react-icons";
const fetcher = (url: string) =>
    fetch(url).then(async (res) => (await res.json()).questions);

export default function Question() {
    const { data, isLoading, isValidating, error } = useSWR<Question[]>(
        `/api/questions/get/`,
        fetcher
    );

    const [searchName, setSearchName] = useState("");
    const [searchDebounce] = useDebounce(searchName, 750);
    console.log(data);
    return (

        <div className="container">
            <div className="grid grid-cols-1  gap-4 mt-10">
                <h2 className="text-3xl font-bold tracking-tight">
                    Questions
                </h2>
                <span className="text-sm text-slate-400">
                    View and answer questions from peers.
                </span>
                <div></div>
                <Input
                    className="w-64"
                    placeholder="Search questions"
                    value={searchName}
                    onChange={(event) =>
                        setSearchName(event.target.value)
                    }
                />
                
            </div>
            <div className="grid grid-cols-1 gap-7 mt-10">
                {isLoading || isValidating ? (
                            [...Array(16)].map((_, index) => (
                                <Skeleton className="w-auto h-28" key={index} />
                            ))
                        ) :
                    (data && data.length > 0 ? (
                        data.map((question: Question, index: number) => (
                            <QuestionCard
                                title={question.title}
                                content={question.content}
                                id={question.id}
                                key={index}
                            ></QuestionCard>
                        ))) : (<div className="flex flex-row h-44 text-center">
                            <span className="font-semibold text-lg w-full h-full text-muted-foreground">
                                Theres nothing here
                            </span>
                        </div>))
                }


            </div>


        </div >
    );
}
