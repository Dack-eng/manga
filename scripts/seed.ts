import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MOCK_MANGA_DATA: any = {
  "sky-boxer": {
    title: "Тэнгэрийн Боксчин (Sky Boxer)",
    cover: "/covers/sky-boxer.png",
    banner: "/covers/sky-boxer.png",
    rating: 4.9,
    chapters_count: 124,
    category: "Action",
    status: "Үргэлжилж буй",
    author: "Shimamoto",
    description: "Дэлхийн хамгийн ширүүн тулаанч болохын төлөөх нэгэн залуугийн аялал. Тэрээр тэнгэрт дүүлэн нисэх мэт хурдтай цохилтоороо алдартай.",
    chapters: [
      { number: 124, title: "Эцсийн тулаан", date: "2026-03-15" },
      { number: 123, title: "Шийдвэрлэх мөч", date: "2026-03-10" },
      { number: 122, title: "Тэнгэрийн хаалга", date: "2026-03-05" },
    ],
  },
  "shadow-blade": {
    title: "Сүүдрийн Ир (Shadow Blade)",
    cover: "/covers/shadow-blade.png",
    banner: "/covers/shadow-blade.png",
    rating: 4.8,
    chapters_count: 86,
    category: "Adventure",
    status: "Үргэлжилж буй",
    author: "Kurosawa",
    description: "Нууцлаг сүүдрийн ертөнцөөс ирсэн дайчин эр. Түүний ир сүүдрээс ч хурдан бөгөөд аюултай.",
    chapters: [
      { number: 86, title: "Харанхуйн эзэн", date: "2026-03-12" },
      { number: 85, title: "Сүүдрийн бүжиг", date: "2026-03-08" },
    ],
  },
  "urban-mage": {
    title: "Хотын Шидтэн (Urban Mage)",
    cover: "/covers/urban-mage.png",
    banner: "/covers/urban-mage.png",
    rating: 4.7,
    chapters_count: 45,
    category: "Fantasy",
    status: "Үргэлжилж буй",
    author: "Aida",
    description: "Орчин үеийн Токио хотын гудамжинд маш том ид шидийн нууц оршиж байдаг. Нэгэн сурагч хүү санамсаргүйгээр энэ ертөнцийг нээх болно.",
    chapters: [
      { number: 45, title: "Неон гэрэлт шид", date: "2026-03-14" },
      { number: 44, title: "Нууц агент", date: "2026-03-09" },
    ],
  },
};

async function main() {
  console.log("Seeding database...");

  for (const slug in MOCK_MANGA_DATA) {
    const mangaData = MOCK_MANGA_DATA[slug];
    
    const manga = await prisma.manga.upsert({
      where: { slug: slug },
      update: {},
      create: {
        slug: slug,
        title: mangaData.title,
        cover: mangaData.cover,
        banner: mangaData.banner,
        rating: mangaData.rating,
        chapters_count: mangaData.chapters_count,
        category: mangaData.category,
        status: mangaData.status,
        author: mangaData.author,
        description: mangaData.description,
      },
    });

    console.log(`Created/Updated manga: ${manga.title}`);

    for (const chapterData of mangaData.chapters) {
      await prisma.chapter.upsert({
        where: {
          mangaId_number: {
            mangaId: manga.id,
            number: chapterData.number,
          },
        },
        update: {},
        create: {
          number: chapterData.number,
          title: chapterData.title,
          date: chapterData.date,
          mangaId: manga.id,
        },
      });
    }
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
