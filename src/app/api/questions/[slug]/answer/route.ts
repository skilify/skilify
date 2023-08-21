import { authOptions, firestore } from "@/app/api/auth/[...nextauth]/route";
import limiter from "@/lib/middleware";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

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

export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
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
    console.log(isValid.data);
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = firestore.doc(`users/${session.user.id}`);
    const questionid = encodeURIComponent(params.slug);
    const question = firestore.doc("/questions/" + questionid);
    await question.update({
        answers: FieldValue.arrayUnion({
            author: user,
            content: isValid.data.content,
            timestamp: Timestamp.fromDate(new Date()),
        }),
    });
    return NextResponse.json({ status: "OK" }, { status: 200 });
}
