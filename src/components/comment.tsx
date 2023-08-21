"use client";

import { Answer } from "@/app/api/questions/[slug]/route";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import Tilt from "react-parallax-tilt";

export function Comment({ props }: { props: Answer }) {
    return (
        <Tilt
            transitionSpeed={500}
            tiltMaxAngleX={4}
            tiltMaxAngleY={2}
            scale={1.02}
            tiltReverse
            glareEnable
            glareBorderRadius="0.75rem"
            glareMaxOpacity={0.17}
        >
            <Card className="border border-input bg-transparent shadow-sm hover:text-accent-foreground">
                <CardHeader>
                    <CardTitle className="text-lg">
                        <Link
                            href={"/profile/" + props.author.id}
                            className="flex flex-row gap-3"
                        >
                            <div className="rounded-full overflow-clip h-10 w-10">
                                <Avatar className="h-10 w-10 rounded-full overflow-clip">
                                    <AvatarImage
                                        src={props.author.image}
                                        alt={props.author.name!}
                                    />
                                    <AvatarFallback className="font-sans">
                                        {props.author.name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {props.author.name}
                        </Link>
                    </CardTitle>
                    <CardContent>{props.content}</CardContent>
                </CardHeader>
                <CardFooter className="text-sm text-gray-500">
                    {new Date(props.timestamp).toLocaleDateString(
                        navigator.language,
                        {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }
                    ) +
                        " " +
                        new Date(props.timestamp).toLocaleTimeString(
                            navigator.language
                        )}
                </CardFooter>
            </Card>
        </Tilt>
    );
}
