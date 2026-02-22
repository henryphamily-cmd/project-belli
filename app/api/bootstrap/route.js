import { seedData } from "@/lib/seed";
import { writeDb } from "@/lib/db";

export async function POST() {
  const data = seedData();
  await writeDb(data);
  return Response.json({ ok: true });
}
