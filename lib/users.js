import bcrypt from "bcryptjs";
import { readDb, withDbUpdate } from "./db";

export function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    profile: user.profile,
    watchlist: user.watchlist,
    logs: user.logs,
    customLists: user.customLists
  };
}

export async function findUserById(userId) {
  const db = await readDb();
  return db.users.find((item) => item.id === userId) || null;
}

export async function findUserByEmail(email) {
  const db = await readDb();
  return db.users.find((item) => item.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function createUser({ email, password, name }) {
  const existing = await findUserByEmail(email);
  if (existing) {
    return { error: "Email already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const handleBase = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16) || "foodie";
  const user = {
    id: `u-${Date.now()}`,
    email,
    passwordHash,
    profile: {
      name,
      handle: `@${handleBase}`,
      bio: ""
    },
    watchlist: [],
    logs: [],
    customLists: []
  };

  await withDbUpdate(async (db) => {
    db.users.push(user);
  });

  return { user };
}

export async function verifyCredentials(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  return isValid ? user : null;
}

export async function updateUser(userId, updater) {
  return withDbUpdate(async (db) => {
    const user = db.users.find((item) => item.id === userId);
    if (!user) {
      return null;
    }
    await updater(user, db);
    return user;
  });
}

export async function getDbSnapshot() {
  return readDb();
}
