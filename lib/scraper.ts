import { upsertChapter, upsertManga, updateMangaChapterCount, upsertPages } from "./data";

interface MangaDexLocalizedText {
  en?: string;
  ja?: string;
  [key: string]: string | undefined;
}

interface MangaDexAltTitle {
  en?: string;
}

interface MangaDexTag {
  attributes?: {
    name?: {
      en?: string;
    };
  };
}

interface MangaDexRelationship {
  type: string;
  attributes?: {
    fileName?: string;
  };
}

interface MangaDexMangaAttributes {
  title: MangaDexLocalizedText;
  altTitles?: MangaDexAltTitle[];
  tags?: MangaDexTag[];
  status?: string;
  description: MangaDexLocalizedText;
}

interface MangaDexMangaResponse {
  result: string;
  errors?: unknown;
  data: {
    attributes: MangaDexMangaAttributes;
    relationships: MangaDexRelationship[];
  };
}

interface MangaDexFeedChapter {
  id: string;
  attributes: {
    chapter: string;
    title?: string;
    publishAt: string;
  };
}

interface MangaDexFeedResponse {
  result: string;
  total: number;
  data: MangaDexFeedChapter[];
}

/**
 * MangaDex API-аас бодит өгөгдөл татах функц.
 */
export async function autoIngestManga(mangaId: string, language: string = "en") {
  console.log(`MangaDex-ээс мэдээлэл татаж байна: ${mangaId} (${language})`);

  try {
    // 1. Манга мэдээлэл авах
    const mangaRes = await fetch(`https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art`);
    const mangaInfo = (await mangaRes.json()) as MangaDexMangaResponse;
    
    if (mangaInfo.result !== "ok") {
      throw new Error(`MangaDex error: ${JSON.stringify(mangaInfo.errors)}`);
    }

    const attr = mangaInfo.data.attributes;
    const rels = mangaInfo.data.relationships;
    
    // Ковер зураг олох
    const coverRel = rels.find((relationship) => relationship.type === "cover_art");
    const coverFileName = coverRel?.attributes?.fileName;
    const coverUrl = coverFileName 
      ? `https://uploads.mangadex.org/covers/${mangaId}/${coverFileName}.512.jpg`
      : "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500";

    const title =
      attr.title.en ||
      attr.title.ja ||
      Object.values(attr.title).find((value): value is string => Boolean(value)) ||
      "Untitled Manga";
    
    // Slug-ийг цэвэрлэх (тусгай тэмдэгтүүдийг устгах)
    const sanitizeSlug = (str: string) => 
      str.toLowerCase()
         .replace(/[^a-z0-9\s-]/g, "") // Зөвхөн үсэг, тоо, зай, зураас үлдээх
         .trim()
         .replace(/\s+/g, "-"); // Зайг зураасаар солих

    const englishAltTitle = attr.altTitles?.find((altTitle) => altTitle.en)?.en;
    const baseSlug = sanitizeSlug(englishAltTitle || title);
    const slug = `${baseSlug}-${language}`;

    const scrapedData = {
      title: `${title} (${language.toUpperCase()})`,
      slug,
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
    const manga = await upsertManga(scrapedData);

    console.log(`Манга хадгалагдлаа: ${manga.title}`);

    // 3. Сүүлийн бүлгүүдийг авах
    const feedRes = await fetch(`https://api.mangadex.org/manga/${mangaId}/feed?limit=30&translatedLanguage[]=${language}&order[chapter]=asc`);
    const feedData = (await feedRes.json()) as MangaDexFeedResponse;

    if (feedData.result === "ok") {
      for (const chapter of feedData.data) {
        const cAttr = chapter.attributes;
        const chapterNumber = parseInt(cAttr.chapter);

        // Skip if chapter number is not a valid number
        if (isNaN(chapterNumber)) {
          console.log(`Skipping chapter: ${cAttr.title || 'Unknown'} (Number: ${cAttr.chapter})`);
          continue;
        }

        const dbChapter = await upsertChapter({
          number: chapterNumber,
          title: cAttr.title || `Chapter ${cAttr.chapter}`,
          date: new Date(cAttr.publishAt).toISOString().split("T")[0],
          mangaId: manga.id,
        });

        // 4. Бүлгийн хуудаснуудыг татах
        try {
          const serverRes = await fetch(`https://api.mangadex.org/at-home/server/${chapter.id}`);
          const serverData = await serverRes.json();
          if (serverData.result === "ok") {
            const pageUrls = serverData.chapter.data.map(
              (filename: string) => `${serverData.baseUrl}/data/${serverData.chapter.hash}/${filename}`
            );
            
            if (pageUrls.length > 0) {
              await upsertPages({
                chapterId: dbChapter.id,
                pages: pageUrls,
              });
              console.log(`  - ${dbChapter.title} (${pageUrls.length} хуудас татагдлаа)`);
            }
          }
        } catch(e) {
          console.error(`Хуудас татахад алдаа гарлаа: ${e}`);
        }
      }
      
      // Бүлгийн тоог шинэчлэх
      await updateMangaChapterCount(manga.id, feedData.total);
    }

    return manga;
  } catch (error) {
    console.error(`Алдаа гарлаа (${mangaId}):`, error);
    throw error;
  }
}
