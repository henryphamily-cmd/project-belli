import { NextResponse } from "next/server";
import { signToken, TOKEN_NAME } from "@/lib/auth";
import { badRequest } from "@/lib/api";
import { toPublicUser, verifyCredentials } from "@/lib/users";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!email || !password) {
    return badRequest("Email and password are required.");
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    return badRequest("Invalid credentials.");
  }

  const token = signToken({ userId: user.id });
  const response = NextResponse.json({ user: toPublicUser(user) });
  response.cookies.set(TOKEN_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return response;
}
