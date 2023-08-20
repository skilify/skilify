import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/app/api/auth/[...nextauth]/route";
import { Question } from "../[slug]/route";

export async function GET(request: NextRequest, response: NextResponse) {
    let exploreQuestions = firestore.collection("questions").limit(16);
    if (request.nextUrl.searchParams.get("cursor")) {
        const cursorSnap = await firestore
            .doc(
                `questions/${encodeURIComponent(
                    request.nextUrl.searchParams.get("cursor")!
                )}`
            )
            .get();
        if (cursorSnap.exists) {
            exploreQuestions = exploreQuestions.startAfter(cursorSnap);
        }
    }
    if (request.nextUrl.searchParams.get("tags")) {
        const tags = request.nextUrl.searchParams.get("tags")!.split(",");
        exploreQuestions = exploreQuestions.where("tags", "array-contains-any", tags);
    }
    if (request.nextUrl.searchParams.get("name")) {
        const name = request.nextUrl.searchParams.get("name")!;
        exploreQuestions = exploreQuestions.where("name", ">=", name);
        exploreQuestions = exploreQuestions.where("name", "<=", name + "\uf8ff");
    }
    const page = await exploreQuestions.get();
    return NextResponse.json({
        questions: page.docs.map((doc) => {
            const questionData = doc.data() as Question;
            return {
                author: questionData.author,
                title: questionData.title,
                content: questionData.content,
                timestamp: questionData.timestamp,
                answers: questionData.answers,
                id: doc.id
            };
        }),
    });
}
