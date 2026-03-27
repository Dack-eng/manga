import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function check() {
  const mangaCount = await prisma.manga.count();
  const chapterCount = await prisma.chapter.count();
  console.log(`\n=== Баазын мэдээлэл ===`);
  console.log(`Нийт Манга: ${mangaCount}`);
  console.log(`Нийт Бүлэг: ${chapterCount}`);
  
  const mangas = await prisma.manga.findMany({ select: { title: true } });
  console.log("Жагсаалт:", mangas.map(m => m.title).join(", "));
}

check().finally(() => prisma.$disconnect());
