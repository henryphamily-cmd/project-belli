const buckets = new Map();

export function rateLimit({ key, max = 1, windowMs = 60000 }) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const record = buckets.get(key) || [];
  const recent = record.filter((ts) => ts > windowStart);

  if (recent.length >= max) {
    const oldest = recent[0];
    const retryAfterMs = Math.max(1, windowMs - (now - oldest));
    return {
      allowed: false,
      retryAfterSec: Math.ceil(retryAfterMs / 1000)
    };
  }

  recent.push(now);
  buckets.set(key, recent);
  return {
    allowed: true,
    retryAfterSec: 0
  };
}

export function getRequestIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}
