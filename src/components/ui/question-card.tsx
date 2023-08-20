import * as React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
type Props = {
    title: string;
    content: string;
    id: string;

}

import { ChevronRightIcon } from "@radix-ui/react-icons"
import { Button } from "./button";
import Link from "next/link";
import { Skeleton } from "./skeleton";
export function QuestionCard(props: Props) {
    return <Link href={"/questions/" + props.id}>
        <Card className="border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground">
            <CardHeader>
                <CardTitle>
                    {props.title}
                    <ChevronRightIcon className="ml-auto h-6 w-6" />
                </CardTitle>
                <CardDescription>
                    {props.content}
                </CardDescription>
            </CardHeader>

        </Card>
    </Link>

}