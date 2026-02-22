import { getUserIdFromRequest, unauthorized, badRequest } from "@/lib/api";
import { findUserById, updateUser } from "@/lib/users";
import { normalizeRestaurantId, sameRestaurantId } from "@/lib/restaurant-id";

export async function GET(request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return unauthorized();
  const user = await findUserById(userId);
  if (!user) return unauthorized();
  return Response.json({ watchlist: user.watchlist });
}

export async function POST(request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return unauthorized();

  const body = await request.json().catch(() => null);
  const restaurantId = normalizeRestaurantId(body?.restaurantId);
  const action = String(body?.action || "toggle");
  if (!restaurantId) return badRequest("restaurantId is required");

  const user = await updateUser(userId, (target, db) => {
    const exists = db.restaurants.some((item) => sameRestaurantId(item.id, restaurantId));
    if (!exists) {
      throw new Error("restaurant_not_found");
    }

    const has = target.watchlist.some((id) => sameRestaurantId(id, restaurantId));
    if (action === "remove") {
      target.watchlist = target.watchlist.filter((id) => !sameRestaurantId(id, restaurantId));
      return;
    }
    if (action === "add") {
      if (!has) target.watchlist.unshift(restaurantId);
      return;
    }
    if (has) {
      target.watchlist = target.watchlist.filter((id) => !sameRestaurantId(id, restaurantId));
    } else {
      target.watchlist.unshift(restaurantId);
    }
  }).catch((error) => ({ error: error.message }));

  if (user?.error === "restaurant_not_found") {
    return badRequest("restaurantId does not exist");
  }
  if (!user) return unauthorized();
  return Response.json({ watchlist: user.watchlist });
}
