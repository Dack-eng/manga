import "dotenv/config";
import { getAllManga } from "../lib/data";

async function run() {
  const allManga = await getAllManga();
  console.log("SLUGS IN DB:");
  allManga.forEach(m => console.log(`- Title: ${m.title} | Slug: '${m.slug}'`));
}

run().catch(console.error);
