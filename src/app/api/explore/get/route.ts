import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/app/api/auth/[...nextauth]/route";
import type { User } from "@/app/api/profile/[slug]/route";

export async function GET(request: NextRequest, response: NextResponse) {
    let exploreUsers = firestore.collection("users").limit(12);
    if (request.nextUrl.searchParams.get("cursor")) {
        const cursorSnap = await firestore
            .doc(
                `users/${encodeURIComponent(
                    request.nextUrl.searchParams.get("cursor")!
                )}`
            )
            .get();
        if (cursorSnap.exists) {
            exploreUsers = exploreUsers.startAfter(cursorSnap);
        }
    }
    if (request.nextUrl.searchParams.get("tags")) {
        const tags = request.nextUrl.searchParams.get("tags")!.split(",");
        exploreUsers = exploreUsers.where("tags", "array-contains-any", tags);
    }
    if (request.nextUrl.searchParams.get("name")) {
        const name = request.nextUrl.searchParams.get("name")!;
        exploreUsers = exploreUsers.where("name", ">=", name);
        exploreUsers = exploreUsers.where("name", "<=", name + "\uf8ff");
    }
    const page = await exploreUsers.get();
    return NextResponse.json({
        users: page.docs.map((doc) => {
            const userData = doc.data() as User;
            return {
                name: userData.name,
                image: userData.image,
                bio: userData.bio,
                tags: userData.tags || [],
                id: doc.id,
                reputation: userData.reputation,
            };
        }),
    });
}
