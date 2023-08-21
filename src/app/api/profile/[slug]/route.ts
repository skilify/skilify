import { NextRequest, NextResponse } from "next/server";
import { authOptions, firestore } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

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

export async function POST(request: NextRequest, response: NextResponse) {}
