import { randomUUID } from "node:crypto";
import { queryRows, withTransaction } from "./db";

export interface Chapter {
  id: string;
  number: number;
  title: string;
  date: string;
}

export interface Page {
  id: string;
  imageUrl: string;
  order: number;
  chapterId: string;
}

export interface Manga {
  id: string;
  slug: string;
  title: string;
  cover: string;
  banner: string;
  rating: number;
  chapters_count: number;
  category: string;
  status: string;
  author: string;
  description: string;
  chapters?: Chapter[];
}

export interface MangaInput {
  slug: string;
  title: string;
  cover: string;
  banner: string;
  rating: number;
  chapters_count: number;
  category: string;
  status: string;
  author: string;
  description: string;
}

export interface ChapterInput {
  mangaId: string;
  number: number;
  title: string;
  date: string;
}

interface ChapterRow extends Chapter {
  mangaId: string;
}

interface JoinedChapterRow extends ChapterRow {
  manga_id: string;
  manga_slug: string;
  manga_title: string;
  manga_cover: string;
  manga_banner: string;
  manga_rating: number;
  manga_chapters_count: number;
  manga_category: string;
  manga_status: string;
  manga_author: string;
  manga_description: string;
}

export interface ChapterWithRelations extends Chapter {
  mangaId: string;
  pages: Page[];
  manga: Manga;
}

const MANGA_COLUMNS = `
  "id",
  "slug",
  "title",
  "cover",
  "banner",
  "rating",
  "chapters_count",
  "category",
  "status",
  "author",
  "description"
`;

export async function getAllManga(): Promise<Manga[]> {
  return queryRows<Manga>(
    `SELECT ${MANGA_COLUMNS}
     FROM "Manga"
     ORDER BY "createdAt" DESC`
  );
}

export async function getMangaBySlug(slug: string): Promise<Manga | null> {
  const [manga] = await queryRows<Manga>(
    `SELECT ${MANGA_COLUMNS}
     FROM "Manga"
     WHERE "slug" = $1
     LIMIT 1`,
    [slug]
  );

  if (!manga) {
    return null;
  }

  const chapters = await queryRows<Chapter>(
    `SELECT "id", "number", "title", "date"
     FROM "Chapter"
     WHERE "mangaId" = $1
     ORDER BY "number" DESC`,
    [manga.id]
  );

  return {
    ...manga,
    chapters,
  };
}

export async function getChapter(
  mangaSlug: string,
  chapterNumber: number
): Promise<ChapterWithRelations | null> {
  const [chapter] = await queryRows<JoinedChapterRow>(
    `SELECT
       c."id",
       c."number",
       c."title",
       c."date",
       c."mangaId",
       m."id" AS "manga_id",
       m."slug" AS "manga_slug",
       m."title" AS "manga_title",
       m."cover" AS "manga_cover",
       m."banner" AS "manga_banner",
       m."rating" AS "manga_rating",
       m."chapters_count" AS "manga_chapters_count",
       m."category" AS "manga_category",
       m."status" AS "manga_status",
       m."author" AS "manga_author",
       m."description" AS "manga_description"
     FROM "Chapter" c
     INNER JOIN "Manga" m ON m."id" = c."mangaId"
     WHERE m."slug" = $1 AND c."number" = $2
     LIMIT 1`,
    [mangaSlug, chapterNumber]
  );

  if (!chapter) {
    return null;
  }

  const pages = await queryRows<Page>(
    `SELECT "id", "imageUrl", "order", "chapterId"
     FROM "Page"
     WHERE "chapterId" = $1
     ORDER BY "order" ASC`,
    [chapter.id]
  );

  return {
    id: chapter.id,
    number: chapter.number,
    title: chapter.title,
    date: chapter.date,
    mangaId: chapter.mangaId,
    pages,
    manga: {
      id: chapter.manga_id,
      slug: chapter.manga_slug,
      title: chapter.manga_title,
      cover: chapter.manga_cover,
      banner: chapter.manga_banner,
      rating: chapter.manga_rating,
      chapters_count: chapter.manga_chapters_count,
      category: chapter.manga_category,
      status: chapter.manga_status,
      author: chapter.manga_author,
      description: chapter.manga_description,
    },
  };
}

export async function upsertManga(input: MangaInput) {
  const [manga] = await queryRows<Manga>(
    `INSERT INTO "Manga" (
       "id",
       "slug",
       "title",
       "cover",
       "banner",
       "rating",
       "chapters_count",
       "category",
       "status",
       "author",
       "description",
       "createdAt",
       "updatedAt"
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
     ON CONFLICT ("slug")
     DO UPDATE SET
       "title" = EXCLUDED."title",
       "cover" = EXCLUDED."cover",
       "banner" = EXCLUDED."banner",
       "rating" = EXCLUDED."rating",
       "chapters_count" = EXCLUDED."chapters_count",
       "category" = EXCLUDED."category",
       "status" = EXCLUDED."status",
       "author" = EXCLUDED."author",
       "description" = EXCLUDED."description",
       "updatedAt" = NOW()
     RETURNING ${MANGA_COLUMNS}`,
    [
      randomUUID(),
      input.slug,
      input.title,
      input.cover,
      input.banner,
      input.rating,
      input.chapters_count,
      input.category,
      input.status,
      input.author,
      input.description,
    ]
  );

  if (!manga) {
    throw new Error(`Failed to upsert manga: ${input.slug}`);
  }

  return manga;
}

export async function upsertChapter(input: ChapterInput) {
  const [chapter] = await queryRows<ChapterRow>(
    `INSERT INTO "Chapter" (
       "id",
       "number",
       "title",
       "date",
       "mangaId",
       "createdAt",
       "updatedAt"
     )
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     ON CONFLICT ("mangaId", "number")
     DO UPDATE SET
       "title" = EXCLUDED."title",
       "date" = EXCLUDED."date",
       "updatedAt" = NOW()
     RETURNING "id", "number", "title", "date", "mangaId"`,
    [randomUUID(), input.number, input.title, input.date, input.mangaId]
  );

  if (!chapter) {
    throw new Error(
      `Failed to upsert chapter ${input.number} for manga ${input.mangaId}`
    );
  }

  return chapter;
}

export async function updateMangaChapterCount(mangaId: string, chaptersCount: number) {
  await queryRows(
    `UPDATE "Manga"
     SET "chapters_count" = $1, "updatedAt" = NOW()
     WHERE "id" = $2`,
    [chaptersCount, mangaId]
  );
}

export async function clearDatabase() {
  await withTransaction(async (db) => {
    await queryRows(`DELETE FROM "Page"`, [], db);
    await queryRows(`DELETE FROM "Chapter"`, [], db);
    await queryRows(`DELETE FROM "Manga"`, [], db);
  });
}

export async function getDatabaseSummary() {
  const [mangaCountRow] = await queryRows<{ count: number }>(
    `SELECT COUNT(*)::int AS "count" FROM "Manga"`
  );
  const [chapterCountRow] = await queryRows<{ count: number }>(
    `SELECT COUNT(*)::int AS "count" FROM "Chapter"`
  );
  const titles = await queryRows<{ title: string }>(
    `SELECT "title" FROM "Manga" ORDER BY "createdAt" DESC`
  );

  return {
    mangaCount: mangaCountRow?.count ?? 0,
    chapterCount: chapterCountRow?.count ?? 0,
    titles: titles.map((item) => item.title),
  };
}
