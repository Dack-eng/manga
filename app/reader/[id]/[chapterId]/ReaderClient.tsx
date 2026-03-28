"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Settings, List, ArrowUp } from "lucide-react";

interface Chapter {
  id: string;
  number: number;
  title: string;
  date: string;
}

interface Manga {
  id: string;
  slug: string;
  title: string;
}

interface ReaderClientProps {
  manga: Manga;
  chapter: Chapter;
  pages: string[];
  nextChapter?: { id: string; number: number } | null;
  prevChapter?: { id: string; number: number } | null;
}

export default function ReaderClient({ manga, chapter, pages, nextChapter, prevChapter }: ReaderClientProps) {
  const [showControls, setShowControls] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > 100) {
        setShowControls(false);
      } else {
        setShowControls(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30">
      {/* Top Controls */}
      <nav className={`fixed top-0 z-50 w-full glass-effect border-b border-white/5 transition-transform duration-300 ${showControls ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href={`/manga/${manga.slug}`} className="hover:text-primary transition-colors">
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-sm font-bold truncate max-w-[150px] sm:max-w-[300px]">{manga.title}</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Бүлэг {chapter.number}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
              <List className="h-5 w-5" />
            </button>
            <button className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Reader Area */}
      <main 
        className="mx-auto max-w-3xl pt-14 pb-20"
        onClick={() => setShowControls(!showControls)}
      >
        <div className="flex flex-col">
          {pages.map((page, index) => (
            <div key={index} className="relative w-full">
              <img
                src={page}
                alt={`Page ${index + 1}`}
                className="w-full h-auto select-none"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Navigation at bottom of pages */}
        <div className="mt-12 px-4 space-y-8 text-center">
          <div className="flex items-center justify-center gap-4">
            {prevChapter && (
              <Link 
                href={`/reader/${manga.slug}/${prevChapter.number}`} 
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" /> Өмнөх
              </Link>
            )}
            {nextChapter && (
              <Link 
                href={`/reader/${manga.slug}/${nextChapter.number}`} 
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Дараах <ChevronRight className="h-5 w-5" />
              </Link>
            )}
          </div>
          
          <p className="text-xs text-zinc-600 italic">Энэ бүлэг дууслаа. Дараагийн бүлэг рүү шилжих эсвэл жагсаалт руу буцна уу.</p>
          
          <Link href={`/manga/${manga.slug}`} className="inline-block text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
            Мэдээлэл рүү буцах
          </Link>
        </div>
      </main>

      {/* Floating Action Button (Scroll to top) */}
      {scrollY > 1000 && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-transform hover:scale-110 active:scale-95"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
