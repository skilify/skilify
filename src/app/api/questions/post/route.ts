import { authOptions, firestore } from "@/app/api/auth/[...nextauth]/route";
import { filter } from "@/lib/badwords";
import limiter from "@/lib/middleware";
import { Timestamp } from "firebase-admin/firestore";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const formSchema = z.object({
    title: z
        .string()
        .min(4, {
            message: "Title must be at least 4 characters.",
        })
        .max(80, { message: "Title must be less than 80 characters." })
        .transform(filter.clean),
    content: z
        .string()
        .min(4, {
            message: "Content must be at least 4 characters.",
        })
        .max(500, {
            message: "Content must be less than 500 characters.",
        })
        .transform(filter.clean),
});

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        await limiter.check(10, request.ip ? request.ip : "0.0.0.0"); // 10 requests per minute
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Rate limit exceeded" },
            { status: 429 }
        );
    }
    const isValid = formSchema.safeParse(await request.json());
    if (!isValid.success)
        return NextResponse.json(
            {
                error: `${isValid.error.issues[0].path} ${isValid.error.issues[0].message}`,
            },
            { status: 400 }
        );

    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = firestore.doc(`users/${session.user.id}`);
    const writeData = {
        answers: [],
        author: user,
        content: isValid.data.content,
        timestamp: Timestamp.fromDate(new Date()),
        title: isValid.data.title,
    };
    const newDoc = firestore.collection("questions").add(writeData);
    return NextResponse.json({ id: (await newDoc).id }, { status: 200 });
}
