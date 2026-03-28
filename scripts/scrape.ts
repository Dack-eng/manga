import "dotenv/config";
import { autoIngestManga } from "../lib/scraper";
import { closePool } from "../lib/db";

const POPULAR_TITLES = [
  "One Piece",
  "Solo Leveling",
  "Blue Lock",
  "Frieren",
  "Chainsaw Man"
];

async function runScraper() {
  console.log("=== Скрапер ажиллаж эхэллээ ===");
  
  for (const title of POPULAR_TITLES) {
    try {
      console.log(`\n'${title}' хайж байна...`);
      const searchRes = await fetch(`https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=1`);
      const searchData = await searchRes.json();
      
      if (searchData.result === "ok" && searchData.data.length > 0) {
        const mangaId = searchData.data[0].id;
        await autoIngestManga(mangaId);
      } else {
        console.log(`'${title}' олдсонгүй.`);
      }
    } catch (err) {
      console.error(`'${title}' дээр алдаа гарлаа:`, err);
    }
  }

  console.log("\n=== Бүх өгөгдөл амжилттай орлоо ===");
}

runScraper().finally(() => closePool());
