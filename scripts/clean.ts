import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function clean() {
  console.log("=== Өгөгдлийн санг цэвэрлэж байна ===");
  await prisma.page.deleteMany({});
  await prisma.chapter.deleteMany({});
  await prisma.manga.deleteMany({});
  console.log("=== Цэвэрлэгээ дууслаа ===");
}

clean()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
