import fs from "fs/promises";
import path from "path";
import { seedData } from "./seed";

const DB_PATH = path.join(process.cwd(), "data", "db.json");
let lock = Promise.resolve();

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch (_err) {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(seedData(), null, 2), "utf8");
  }
}

async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(raw);
}

async function writeDb(nextData) {
  await fs.writeFile(DB_PATH, JSON.stringify(nextData, null, 2), "utf8");
}

export function withDbUpdate(mutator) {
  lock = lock.then(async () => {
    const db = await readDb();
    const result = await mutator(db);
    await writeDb(db);
    return result;
  });
  return lock;
}

export { readDb, writeDb };
