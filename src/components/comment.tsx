"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Link from "next/link";
import { Answer } from "@/app/api/questions/[slug]/route";

export function Comment({ props }: { props: Answer }) {
  return (
    <Card className="border border-input bg-transparent shadow-sm hover:text-accent-foreground">
      <CardHeader>
        <CardTitle className="text-lg">
          <Link className="flex flex-row gap-3" href={"/profiles/" + props.author.id}>
            <div className="rounded-full overflow-clip h-10 w-10">
              <Avatar className="h-10 w-10 rounded-full overflow-clip">
                <AvatarImage
                  src={props.author.image}
                  alt={props.author.name!}
                />
                <AvatarFallback className="font-sans">
                  {props.author.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {props.author.name}
          </Link>
        </CardTitle>
        <CardContent>{props.content}</CardContent>
      </CardHeader>
      <CardFooter className="text-sm text-gray-500">
        {new Date(props.timestamp).toLocaleDateString(navigator.language, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }) + " " + new Date(props.timestamp).toLocaleTimeString(navigator.language)}
      </CardFooter>
    </Card>
  );
}
