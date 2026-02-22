import { getUserIdFromRequest, unauthorized, badRequest } from "@/lib/api";
import { findUserById, updateUser } from "@/lib/users";
import { normalizeRestaurantId, sameRestaurantId } from "@/lib/restaurant-id";

export async function GET(request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return unauthorized();
  const user = await findUserById(userId);
  if (!user) return unauthorized();
  return Response.json({ lists: user.customLists });
}

export async function POST(request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return unauthorized();
  const body = await request.json().catch(() => null);
  const mode = String(body?.mode || "create");

  const user = await updateUser(userId, (target, db) => {
    if (mode === "create") {
      const title = String(body?.title || "").trim();
      if (!title) throw new Error("title_required");
      target.customLists.unshift({
        id: `list-${Date.now()}`,
        title: title.slice(0, 80),
        description: String(body?.description || "").slice(0, 160),
        itemIds: []
      });
      return;
    }

    const listId = String(body?.listId || "");
    const list = target.customLists.find((item) => item.id === listId);
    if (!list) throw new Error("list_not_found");

    if (mode === "delete") {
      target.customLists = target.customLists.filter((item) => item.id !== listId);
      return;
    }

    const restaurantId = normalizeRestaurantId(body?.restaurantId);
    if (!restaurantId) throw new Error("restaurant_required");
    const exists = db.restaurants.some((item) => sameRestaurantId(item.id, restaurantId));
    if (!exists) throw new Error("restaurant_not_found");

    if (mode === "add-item") {
      if (!list.itemIds.some((id) => sameRestaurantId(id, restaurantId))) list.itemIds.push(restaurantId);
      return;
    }

    if (mode === "remove-item") {
      list.itemIds = list.itemIds.filter((id) => !sameRestaurantId(id, restaurantId));
    }
  }).catch((err) => ({ error: err.message }));

  if (user?.error === "title_required") return badRequest("List title is required");
  if (user?.error === "list_not_found") return badRequest("List not found");
  if (user?.error === "restaurant_required") return badRequest("restaurantId is required");
  if (user?.error === "restaurant_not_found") return badRequest("restaurantId does not exist");
  if (!user) return unauthorized();
  return Response.json({ lists: user.customLists });
}
