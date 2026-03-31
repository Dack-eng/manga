import "dotenv/config";
import { getMangaBySlug } from "../lib/data";

async function run() {
  const result = await getMangaBySlug("chainsaw-man");
  console.log("RESULT:", result);
}

run().catch(console.error);
