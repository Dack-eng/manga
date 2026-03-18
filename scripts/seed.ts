import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { MOCK_MANGA_DATA } from "../lib/data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  for (const slug in MOCK_MANGA_DATA) {
    const mangaData = MOCK_MANGA_DATA[slug];
    
    // Create or update Manga
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

    // Create Chapters
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
