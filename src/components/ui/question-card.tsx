import * as React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type Props = {
    title: string;
    content: string;

}

import { ChevronRightIcon } from "@radix-ui/react-icons"
export function QuestionCard(props: Props) {
    return <Card>
        <CardHeader>

            <CardTitle>
                {props.title} <ChevronRightIcon className="ml-auto h-6 w-6" />
            </CardTitle>
            <CardDescription>
                {props.content}
            </CardDescription>
        </CardHeader>

    </Card>
}