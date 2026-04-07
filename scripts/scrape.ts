import "dotenv/config";
import { autoIngestManga } from "../lib/scraper";
import { closePool } from "../lib/db";

const TARGET_MANGA_ID = "e7eabe96-aa17-476f-b431-2497d5e9d060"; // Black Clover

async function runScraper() {
  console.log("=== Скрапер ажиллаж эхэллээ ===");
  
  try {
    console.log(`\n'Black Clover' МН хэлээр татаж байна...`);
    await autoIngestManga(TARGET_MANGA_ID, "mn");
    
    console.log(`\n'Black Clover' JA хэлээр татаж байна...`);
    await autoIngestManga(TARGET_MANGA_ID, "ja");
  } catch (err) {
    console.error(`Алдаа гарлаа:`, err);
  }

  console.log("\n=== Бүх өгөгдөл амжилттай орлоо ===");
}

runScraper().finally(() => closePool());
