import { getUserIdFromRequest, unauthorized, badRequest } from "@/lib/api";
import { withDbUpdate } from "@/lib/db";

function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function pickCity(place) {
  if (typeof place.city === "string" && place.city.trim()) return place.city.trim();
  const address = String(place.address || "");
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) return parts[parts.length - 2];
  return parts[0] || "Unknown";
}

export async function POST(request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return unauthorized();

  const body = await request.json().catch(() => null);
  const place = body?.place;
  if (!place || typeof place !== "object") {
    return badRequest("place payload is required");
  }

  const name = String(place.name || "").trim();
  const existingRestaurantId =
    typeof place.existingRestaurantId === "number" || typeof place.existingRestaurantId === "string"
      ? place.existingRestaurantId
      : null;
  if (existingRestaurantId !== null) {
    const existingLocal = await withDbUpdate(async (db) => {
      const match = db.restaurants.find((item) => String(item.id) === String(existingRestaurantId));
      if (!match) throw new Error("restaurant_not_found");
      return { restaurant: match, created: false };
    }).catch((error) => ({ error: error.message }));

    if (existingLocal?.error === "restaurant_not_found") {
      return badRequest("existingRestaurantId does not exist");
    }
    return Response.json(existingLocal);
  }

  if (!name) {
    return badRequest("place.name is required");
  }

  const placeIdRaw = String(place.placeId || "").trim();
  const restaurantId = placeIdRaw ? `g:${placeIdRaw}` : `c:${toSlug(name)}-${Date.now()}`;

  const created = await withDbUpdate(async (db) => {
    const existing = db.restaurants.find((item) => String(item.id) === String(restaurantId));
    if (existing) {
      return { restaurant: existing, created: false };
    }

    const rating = Number(place.rating);
    const priceLevel = Number(place.priceLevel);

    const restaurant = {
      id: restaurantId,
      name,
      cuisine: String(place.cuisine || "Imported").trim() || "Imported",
      city: pickCity(place),
      neighborhood: String(place.neighborhood || place.address || "Imported from map").slice(0, 80),
      price: Number.isFinite(priceLevel) ? Math.max(1, Math.min(4, Math.round(priceLevel))) : 2,
      popularity: Number.isFinite(rating) ? Math.round(rating * 20) : 70,
      tags: ["imported", "map"],
      image: String(place.image || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80"),
      mapUrl: String(place.mapUrl || ""),
      source: placeIdRaw ? "google" : "manual"
    };

    db.restaurants.unshift(restaurant);
    return { restaurant, created: true };
  });

  return Response.json(created, { status: created.created ? 201 : 200 });
}
