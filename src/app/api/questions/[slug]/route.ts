import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/app/api/auth/[...nextauth]/route";
import { DocumentReference, Timestamp } from "firebase-admin/firestore";

export type Answer = {
  author: { name: string; image: string; id: string };
  content: string;
  timestamp: string;
};

type ServerAnswer = {
  //shit answer
  author: DocumentReference;
  content: string;
  timestamp: Timestamp;
};

export type Question = {
  author: {
    name: string;
    id: string;
    image: string;
  };
  title: string;
  content: string;
  timestamp: string;
  answers: Answer[];
  id: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const question = firestore.doc(
    `questions/${encodeURIComponent(params.slug)}`
  );
  const questionObject = await question.get();
  if (!questionObject.exists)
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  const questionData = questionObject.data();
  if (!questionData)
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  const a = await questionData.author.get();
  let adata = a.data();
  if (!a.exists || !adata) {
    adata = { name: "shtiter" };
  }
  return NextResponse.json({
    question: {
      author: {
        name: adata.name,
        image: adata.image,
        id: a.id,
      },
      title: questionData.title,
      content: questionData.content,
      timestamp: questionData.timestamp.toDate().toString(),
      answers: await Promise.all(
        questionData.answers.map(async (i: ServerAnswer): Promise<Answer> => {
          const author = await i.author.get();
          let authordata = author.data();
          if (!author.exists || !authordata) {
            authordata = { name: "shtiter" };
          }
          return {
            author: {
              name: authordata.name,
              image: authordata.image,
              id: author.id,
            },
            content: i.content,
            timestamp: i.timestamp.toDate().toString(),
          };
        })
      ),
      id: questionObject.id,
    },
  });
}
