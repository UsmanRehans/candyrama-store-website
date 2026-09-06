import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/schemas/commerce";
import { db } from "@/lib/server/db";

export async function POST(request: NextRequest) {
  try {
    const input = newsletterSchema.parse(await request.json());
    await db.newsletterSubscriber.upsert({
      where: { email: input.email.toLowerCase() },
      create: {
        email: input.email.toLowerCase(),
        source: input.source,
      },
      update: { active: true, source: input.source },
    });
    return NextResponse.json({ data: { subscribed: true } }, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "issues" in error)
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    console.error("newsletter_signup_failed", error);
    return NextResponse.json(
      { error: "Signup is taking a candy break. Try again soon." },
      { status: 503 },
    );
  }
}
