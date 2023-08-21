import { NextRequest, NextResponse } from "next/server";
import { authOptions, firestore } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { DocumentReference } from "firebase-admin/firestore";

export type User = {
    name: string;
    image: string;
    bio: string;
    tags: string[];
    id: string;
    reputation: number;
};

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    const user = firestore.doc(`users/${encodeURIComponent(params.slug)}`);
    const userObject = await user.get();
    if (!userObject.exists)
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    const userData = userObject.data();
    if (!userData)
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({
        user: {
            name: userData.name,
            image: userData.image,
            bio: userData.bio,
            tags: userData.tags || [],
            id: userObject.id,
            reputation: userData.reputation,
        },
    });
}

export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = firestore.doc(`users/${encodeURIComponent(params.slug)}`);
    if (user.id === session.user.id)
        return NextResponse.json(
            { error: "You cannot upvote yourself." },
            { status: 400 }
        );
    const userObject = await user.get();
    if (!userObject.exists)
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    const userData = userObject.data();
    if (!userData)
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (
        userData.upvoters &&
        userData.upvoters.find(
            (u: DocumentReference) => u.id === session.user.id
        )
    )
        return NextResponse.json(
            { error: "You have already upvoted this user." },
            { status: 400 }
        );

    const newRep = (userData.reputation || 0) + 1;

    await user.update({
        reputation: newRep,
        upvoters: [
            ...(userData.upvoters || []),
            firestore.doc(`users/${session.user.id}`),
        ],
    });

    return NextResponse.json({
        user: {
            name: userData.name,
            image: userData.image,
            bio: userData.bio,
            tags: userData.tags || [],
            id: userObject.id,
            reputation: newRep,
        },
    });
}
