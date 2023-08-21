import { NextRequest, NextResponse } from "next/server";
import { authOptions, firestore } from "@/app/api/auth/[...nextauth]/route";
import type { User } from "@/app/api/profile/[slug]/route";
import { getServerSession } from "next-auth/next";
import * as z from "zod";
import validator from "validator";
import limiter from "@/lib/middleware";

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
  try {
    await limiter.check(10, request.ip ? request.ip : "0.0.0.0"); // 10 requests per minute
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const isValid = FormSchema.safeParse(await request.json());
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
  await user.update({
    bio: isValid.data.bio || "",
    tags: isValid.data.tags || [],
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
