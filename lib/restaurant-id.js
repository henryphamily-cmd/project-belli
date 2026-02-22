export function normalizeRestaurantId(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^\d+$/.test(trimmed)) {
      return Number(trimmed);
    }
    return trimmed.slice(0, 120);
  }

  return null;
}

export function sameRestaurantId(a, b) {
  return String(a) === String(b);
}
