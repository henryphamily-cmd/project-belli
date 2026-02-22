import { badRequest } from "@/lib/api";
import { readDb } from "@/lib/db";

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function GET(request) {
  const key = process.env.GOOGLE_MAPS_API_KEY;

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  const location = (searchParams.get("location") || "").trim();
  const lat = toNumber(searchParams.get("lat"));
  const lng = toNumber(searchParams.get("lng"));

  if (!q) {
    return badRequest("Query is required.");
  }

  if (!key) {
    const db = await readDb();
    const tokens = [q, location]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    const results = db.restaurants
      .filter((item) => {
        const haystack = `${item.name} ${item.city} ${item.neighborhood} ${(item.tags || []).join(" ")}`.toLowerCase();
        return tokens.every((token) => haystack.includes(token));
      })
      .slice(0, 12)
      .map((item) => ({
        resultId: `local-${item.id}`,
        existingRestaurantId: item.id,
        placeId: "",
        name: item.name,
        address: `${item.neighborhood}, ${item.city}`,
        rating: null,
        userRatingsTotal: 0,
        priceLevel: item.price || null,
        lat: null,
        lng: null,
        openNow: null,
        mapUrl:
          item.mapUrl ||
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name} ${item.city}`)}`,
        source: "local"
      }));

    return Response.json({
      results,
      warning:
        "GOOGLE_MAPS_API_KEY not set. Showing local Bellibox matches instead of live Google Places."
    });
  }

  const query = [q, location].filter(Boolean).join(" ");
  const params = new URLSearchParams({
    query,
    type: "restaurant",
    key
  });

  if (lat !== null && lng !== null) {
    params.set("location", `${lat},${lng}`);
    params.set("radius", "12000");
  }

  const upstream = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?${params.toString()}`,
    {
      cache: "no-store"
    }
  );

  if (!upstream.ok) {
    return Response.json(
      { error: `Google Places request failed (${upstream.status}).` },
      { status: 502 }
    );
  }

  const data = await upstream.json();
  if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    return Response.json(
      { error: data.error_message || `Google Places status: ${data.status}` },
      { status: 502 }
    );
  }

  const results = (data.results || []).slice(0, 12).map((place) => ({
    resultId: place.place_id || `google-${place.name}`,
    placeId: place.place_id,
    name: place.name,
    address: place.formatted_address,
    rating: place.rating || null,
    userRatingsTotal: place.user_ratings_total || 0,
    priceLevel: place.price_level || null,
    lat: place.geometry?.location?.lat ?? null,
    lng: place.geometry?.location?.lng ?? null,
    openNow: place.opening_hours?.open_now ?? null,
    mapUrl: place.place_id
      ? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(place.place_id)}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.formatted_address || ""}`)}`
  }));

  return Response.json({ results });
}
