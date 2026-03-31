"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

interface MangaCardProps {
  id: string;
  title: string;
  cover: string;
  rating: number;
  chapters: number;
  category: string;
}

export default function MangaCard({ id, title, cover, rating, chapters, category }: MangaCardProps) {
  const { t } = useLanguage();
  
  return (
    <Link href={`/manga/${id}`} className="group relative block w-full overflow-hidden rounded-xl bg-card manga-card-hover">
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={cover}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      
      <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
        {rating.toFixed(1)}
      </div>

      <div className="absolute bottom-0 w-full p-4 transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">{category}</div>
        <h3 className="line-clamp-2 text-sm font-bold leading-tight text-white">{title}</h3>
        <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-zinc-300">
          <span>{chapters} {t('chapters')}</span>
          <span className="rounded bg-white/10 px-1.5 py-0.5">{t('new')}</span>
        </div>
      </div>
    </Link>
  );
}
