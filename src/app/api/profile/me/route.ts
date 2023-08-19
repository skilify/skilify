import { NextRequest, NextResponse } from "next/server";
import { authOptions, firestore } from "@/app/api/auth/[...nextauth]/route";
import type { User } from "@/app/api/profile/[slug]/route";
import { getServerSession } from "next-auth/next";

export async function GET(request: NextRequest, response: NextResponse) {
    const sessionUser = await getServerSession(authOptions);
    if (
        !sessionUser ||
        !sessionUser.user ||
        !sessionUser.user.email ||
        !sessionUser.user.name
    )
        return NextResponse.json({ error: "User not found" }, { status: 404 });

    const user = firestore
        .collection("users")
        .where("email", "==", sessionUser.user.email)
        .where("name", "==", sessionUser.user.name)
        .limit(1);
    const userObject = await user.get();
    if (userObject.empty)
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    const userData = userObject.docs[0];
    if (!userData || userData.exists === false)
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    const userDataObject = userData.data() as User;
    if (!userDataObject)
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({
        user: {
            name: userDataObject.name,
            image: userDataObject.image,
            bio: userDataObject.bio,
            tags: userDataObject.tags || [],
            id: userData.id,
            reputation: userDataObject.reputation,
        },
    });
}
