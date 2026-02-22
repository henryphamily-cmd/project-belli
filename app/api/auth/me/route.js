import { getUserIdFromRequest, unauthorized } from "@/lib/api";
import { findUserById, toPublicUser } from "@/lib/users";

export async function GET(request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return unauthorized();
  }

  const user = await findUserById(userId);
  if (!user) {
    return unauthorized();
  }

  return Response.json({ user: toPublicUser(user) });
}
