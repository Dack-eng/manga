import { prisma } from "./prisma";

export interface Chapter {
  id: string;
  number: number;
  title: string;
  date: string;
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

export async function getAllManga(): Promise<Manga[]> {
  const manga = await prisma.manga.findMany({
    orderBy: { createdAt: "desc" },
  });
  return manga as Manga[];
}

export async function getMangaBySlug(slug: string): Promise<Manga | null> {
  const manga = await prisma.manga.findUnique({
    where: { slug },
    include: {
      chapters: {
        orderBy: { number: "desc" },
      },
    },
  });
  return manga as (Manga & { chapters: Chapter[] }) | null;
}

export async function getChapter(mangaSlug: string, chapterNumber: number) {
  const chapter = await prisma.chapter.findFirst({
    where: {
      number: chapterNumber,
      manga: { slug: mangaSlug },
    },
    include: {
      pages: {
        orderBy: { order: "asc" },
      },
      manga: true,
    },
  });
  return chapter;
}
