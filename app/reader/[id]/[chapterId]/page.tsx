import { getChapter, getMangaBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import ReaderClient from "./ReaderClient";

export default async function ReaderPage({ params }: { params: { id: string, chapterId: string } }) {
  const chapterNumber = parseInt(params.chapterId);
  const data = await getChapter(params.id, chapterNumber);

  if (!data) {
    notFound();
  }

  const { manga, ...chapter } = data;
  
  // In a real app, pages come from data.pages. 
  // For demo, we still use mock images if pages are empty.
  const pages = data.pages.length > 0 
    ? data.pages.map((page) => page.imageUrl) 
    : [manga.cover, manga.banner, manga.cover];

  // Fetch adjacent chapters for navigation
  const fullManga = await getMangaBySlug(manga.slug);
  const nextChapter = fullManga?.chapters?.find(c => c.number === chapter.number + 1);
  const prevChapter = fullManga?.chapters?.find(c => c.number === chapter.number - 1);

  return (
    <ReaderClient 
      manga={manga} 
      chapter={chapter} 
      pages={pages}
      nextChapter={nextChapter ? { id: nextChapter.id, number: nextChapter.number } : null}
      prevChapter={prevChapter ? { id: prevChapter.id, number: prevChapter.number } : null}
    />
  );
}
