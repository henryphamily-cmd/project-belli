import { NextResponse } from "next/server";
import { signToken, TOKEN_NAME } from "@/lib/auth";
import { badRequest } from "@/lib/api";
import { createUser, toPublicUser } from "@/lib/users";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  const name = String(body?.name || "").trim();

  if (!email || !password || !name) {
    return badRequest("Name, email, and password are required.");
  }

  if (password.length < 6) {
    return badRequest("Password must be at least 6 characters.");
  }

  const result = await createUser({ email, password, name });
  if (result.error) {
    return badRequest(result.error);
  }

  const token = signToken({ userId: result.user.id });
  const response = NextResponse.json({ user: toPublicUser(result.user) }, { status: 201 });
  response.cookies.set(TOKEN_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return response;
}
