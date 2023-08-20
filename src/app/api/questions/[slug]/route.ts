import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/app/api/auth/[...nextauth]/route";
import { Timestamp } from "firebase-admin/firestore";

export type Answer = {
    author: string;
    content: string;
    timestamp: Timestamp;
    votes: number;
}

export type Question = {
    author: string;
    title: string;
    content: string;
    timestamp: Timestamp;
    answers: Answer[]
    id: string;
};

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    const question = firestore.doc(`questions/${encodeURIComponent(params.slug)}`);
    const questionObject = await question.get();
    if (!questionObject.exists)
        return NextResponse.json({ error: "Question not found" }, { status: 404 });
    const questionData = questionObject.data();
    if (!questionData)
        return NextResponse.json({ error: "Question not found" }, { status: 404 });
    return NextResponse.json({
        question: {
            author: questionData.author,
            title: questionData.title,
            content: questionData.content,
            timestamp: questionData.timestamp,
            answers: questionData.answers,
            id: questionObject.id
        }
    });
}
