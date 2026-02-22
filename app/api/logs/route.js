import { getUserIdFromRequest, unauthorized, badRequest } from "@/lib/api";
import { findUserById, updateUser } from "@/lib/users";
import { normalizeRestaurantId, sameRestaurantId } from "@/lib/restaurant-id";

function clampRating(value) {
  const parsed = Number(value);
  const safe = Number.isFinite(parsed) ? parsed : 4;
  const snapped = Math.round(safe * 2) / 2;
  return Math.min(5, Math.max(0.5, snapped));
}

export async function GET(request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return unauthorized();
  const user = await findUserById(userId);
  if (!user) return unauthorized();
  return Response.json({ logs: user.logs });
}

export async function POST(request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return unauthorized();

  const body = await request.json().catch(() => null);
  const restaurantId = normalizeRestaurantId(body?.restaurantId);
  const rating = clampRating(body?.rating);
  const note = String(body?.note || "").slice(0, 400);
  const date = String(body?.date || "").slice(0, 10);

  if (!restaurantId || !date) {
    return badRequest("restaurantId and date are required");
  }

  const user = await updateUser(userId, (target, db) => {
    const exists = db.restaurants.some((item) => sameRestaurantId(item.id, restaurantId));
    if (!exists) {
      throw new Error("restaurant_not_found");
    }

    target.logs.unshift({
      id: `log-${Date.now()}`,
      restaurantId,
      rating,
      note,
      date
    });
    target.watchlist = target.watchlist.filter((id) => !sameRestaurantId(id, restaurantId));
  }).catch((error) => ({ error: error.message }));

  if (user?.error === "restaurant_not_found") {
    return badRequest("restaurantId does not exist");
  }
  if (!user) return unauthorized();
  return Response.json({ logs: user.logs });
}
