import "dotenv/config";
import { clearDatabase } from "../lib/data";
import { closePool } from "../lib/db";

async function clean() {
  console.log("=== Өгөгдлийн санг цэвэрлэж байна ===");
  await clearDatabase();
  console.log("=== Цэвэрлэгээ дууслаа ===");
}

clean()
  .catch((error) => console.error(error))
  .finally(() => closePool());
