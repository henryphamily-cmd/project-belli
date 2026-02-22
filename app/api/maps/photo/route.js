import { badRequest } from "@/lib/api";

export async function GET(request) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return Response.json({ error: "GOOGLE_MAPS_API_KEY is missing." }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const ref = (searchParams.get("ref") || "").trim();
  const maxwidth = Number(searchParams.get("maxwidth") || 800);

  if (!ref) {
    return badRequest("ref is required");
  }

  const width = Number.isFinite(maxwidth) ? Math.max(200, Math.min(1600, Math.round(maxwidth))) : 800;
  const upstream = await fetch(
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${width}&photo_reference=${encodeURIComponent(ref)}&key=${encodeURIComponent(key)}`,
    { cache: "no-store", redirect: "follow" }
  );

  if (!upstream.ok) {
    return Response.json({ error: `Photo fetch failed (${upstream.status})` }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") || "image/jpeg";
  const bytes = await upstream.arrayBuffer();

  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600"
    }
  });
}
