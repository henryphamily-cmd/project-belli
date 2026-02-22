import { getUserIdFromRequest, unauthorized, badRequest } from "@/lib/api";
import { findUserById, updateUser } from "@/lib/users";

export async function GET(request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return unauthorized();
  const user = await findUserById(userId);
  if (!user) return unauthorized();
  return Response.json({ profile: user.profile });
}

export async function PUT(request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return unauthorized();
  const body = await request.json().catch(() => null);

  const name = String(body?.name || "").trim();
  const handleRaw = String(body?.handle || "").replace(/\s+/g, "").replace(/^@+/, "");
  const bio = String(body?.bio || "").slice(0, 200);
  if (!name) return badRequest("Name is required");

  const user = await updateUser(userId, (target) => {
    target.profile = {
      name,
      handle: `@${handleRaw || "foodie"}`,
      bio
    };
  });

  if (!user) return unauthorized();
  return Response.json({ profile: user.profile });
}
