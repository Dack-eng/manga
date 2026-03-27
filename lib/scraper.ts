import { prisma } from "./prisma";

/**
 * MangaDex API-аас бодит өгөгдөл татах функц.
 */
export async function autoIngestManga(mangaId: string) {
  console.log(`MangaDex-ээс мэдээлэл татаж байна: ${mangaId}`);

  try {
    // 1. Манга мэдээлэл авах
    const mangaRes = await fetch(`https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art`);
    const mangaInfo = await mangaRes.json();
    
    if (mangaInfo.result !== "ok") {
      throw new Error(`MangaDex error: ${JSON.stringify(mangaInfo.errors)}`);
    }

    const attr = mangaInfo.data.attributes;
    const rels = mangaInfo.data.relationships;
    
    // Ковер зураг олох
    const coverRel = rels.find((r: any) => r.type === "cover_art");
    const coverFileName = coverRel?.attributes?.fileName;
    const coverUrl = coverFileName 
      ? `https://uploads.mangadex.org/covers/${mangaId}/${coverFileName}.512.jpg`
      : "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500";

    const title = attr.title.en || attr.title.ja || Object.values(attr.title)[0];
    const slug = attr.altTitles?.find((t: any) => t.en)?.en?.toLowerCase().replace(/ /g, "-") || 
                 title.toLowerCase().replace(/ /g, "-") + "-" + mangaId.slice(0, 5);

    const scrapedData = {
      title: title as string,
      slug: slug as string,
      cover: coverUrl,
      banner: coverUrl, // МангаДекс дээр тусдаа баннер байхгүй бол ковер ашиглая
      rating: 4.5,
      chapters_count: 0,
      category: attr.tags?.[0]?.attributes?.name?.en || "Manga",
      status: attr.status === "ongoing" ? "Үргэлжилж буй" : "Дууссан",
      author: "MangaDex Artist",
      description: attr.description.en || "Тайлбар олдсонгүй.",
    };

    // 2. Өгөгдлийн сан руу хадгалах
    const manga = await prisma.manga.upsert({
      where: { slug: scrapedData.slug },
      update: scrapedData,
      create: scrapedData,
    });

    console.log(`Манга хадгалагдлаа: ${manga.title}`);

    // 3. Сүүлийн 5 бүлгийг авах
    const feedRes = await fetch(`https://api.mangadex.org/manga/${mangaId}/feed?limit=5&translatedLanguage[]=en&order[chapter]=desc`);
    const feedData = await feedRes.json();

    if (feedData.result === "ok") {
      for (const chapter of feedData.data) {
        const cAttr = chapter.attributes;
        const chapterNumber = parseInt(cAttr.chapter);

        // Skip if chapter number is not a valid number
        if (isNaN(chapterNumber)) {
          console.log(`Skipping chapter: ${cAttr.title || 'Unknown'} (Number: ${cAttr.chapter})`);
          continue;
        }

        await prisma.chapter.upsert({
          where: {
            mangaId_number: {
              mangaId: manga.id,
              number: chapterNumber,
            },
          },
          update: {},
          create: {
            number: chapterNumber,
            title: cAttr.title || `Chapter ${cAttr.chapter}`,
            date: new Date(cAttr.publishAt).toISOString().split('T')[0],
            mangaId: manga.id,
          },
        });
      }
      
      // Бүлгийн тоог шинэчлэх
      await prisma.manga.update({
        where: { id: manga.id },
        data: { chapters_count: feedData.total }
      });
    }

    return manga;
  } catch (error) {
    console.error(`Алдаа гарлаа (${mangaId}):`, error);
    throw error;
  }
}
