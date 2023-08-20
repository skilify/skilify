import { NextRequest, NextResponse } from "next/server";
import { authOptions, firestore } from "@/app/api/auth/[...nextauth]/route";
import type { User } from "@/app/api/profile/[slug]/route";
import { getServerSession } from "next-auth/next";
import * as z from "zod";
import validator from "validator";

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

const FormSchema = z.object({
    bio: z
        .string()
        .max(100, {
            message: "Bio must not be longer than 100 characters.",
        })
        .optional()
        .refine(
            (val) =>
                validator.isAlphanumeric(val || "", "en-US", {
                    ignore: " -.#",
                }),
            {
                message: "Bio must be alphanumeric.",
            }
        ),
    tags: z
        .array(
            z
                .string()
                .max(20, { message: "Tag must be less than 20 characters." })
                .refine(
                    (val) =>
                        validator.isAlphanumeric(val || "", "en-US", {
                            ignore: " -.#",
                        }),
                    {
                        message: "Tag must be alphanumeric.",
                    }
                )
        )
        .optional(),
});

export async function PATCH(request: NextRequest, response: NextResponse) {
    const isValid = FormSchema.safeParse(await request.json());
    if (!isValid.success)
        return NextResponse.json(
            {
                error: `${isValid.error.issues[0].path} ${isValid.error.issues[0].message}`,
            },
            { status: 400 }
        );

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

    userData.ref.update({
        bio: isValid.data.bio || "",
        tags: isValid.data.tags || [],
    });

    return NextResponse.json({ success: true }, { status: 200 });
}
