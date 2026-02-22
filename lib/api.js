import { NextResponse } from "next/server";
import { TOKEN_NAME, verifyToken } from "./auth";

export function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function badRequest(message) {
  return json({ error: message }, 400);
}

export function unauthorized(message = "Unauthorized") {
  return json({ error: message }, 401);
}

export function getUserIdFromRequest(request) {
  const token = request.cookies.get(TOKEN_NAME)?.value;
  if (!token) {
    return null;
  }
  const payload = verifyToken(token);
  return payload?.userId || null;
}
