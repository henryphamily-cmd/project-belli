import jwt from "jsonwebtoken";

export const TOKEN_NAME = "bellibox_token";
const JWT_SECRET = process.env.JWT_SECRET || "dev-only-secret-change-me";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (_err) {
    return null;
  }
}
