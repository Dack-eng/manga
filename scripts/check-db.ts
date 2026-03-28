import "dotenv/config";
import { closePool } from "../lib/db";
import { getDatabaseSummary } from "../lib/data";

async function check() {
  const { mangaCount, chapterCount, titles } = await getDatabaseSummary();
  console.log(`\n=== Баазын мэдээлэл ===`);
  console.log(`Нийт Манга: ${mangaCount}`);
  console.log(`Нийт Бүлэг: ${chapterCount}`);

  console.log("Жагсаалт:", titles.join(", "));
}

check().finally(() => closePool());
