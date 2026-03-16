import { MOCK_MANGA_DATA } from "@/lib/data";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, Clock, BookOpen, Play, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function MangaDetailPage({ params }: { params: { id: string } }) {
  const manga = MOCK_MANGA_DATA[params.id];

  if (!manga) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Banner Section */}
      <div className="relative h-[300px] w-full overflow-hidden md:h-[450px]">
        <Image
          src={manga.banner}
          alt={manga.title}
          fill
          className="object-cover opacity-30 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <main className="mx-auto -mt-40 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          {/* Cover Image */}
          <div className="relative mx-auto w-64 flex-shrink-0 md:mx-0">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <Image
                src={manga.cover}
                alt={manga.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Info Details */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
                  {manga.category}
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/70">
                  {manga.status}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                {manga.title}
              </h1>
              <p className="text-lg font-medium text-zinc-400">Зохиолч: {manga.author}</p>
            </div>

            <div className="flex items-center justify-center gap-6 md:justify-start">
              <div className="flex items-center gap-1.5">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-bold text-white">{manga.rating}</span>
              </div>
              <div className="h-4 w-px bg-zinc-800" />
              <div className="flex items-center gap-1.5 text-zinc-400">
                <BookOpen className="h-5 w-5" />
                <span className="font-medium">{manga.chapters_count} Бүлэг</span>
              </div>
            </div>

            <p className="max-w-2xl text-base leading-relaxed text-zinc-400">
              {manga.description}
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              <Link href={`/reader/${manga.id}/1`} className="flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                <Play className="h-4 w-4 fill-white" />
                УНШИЖ ЭХЛЭХ
              </Link>
              <button className="flex h-12 items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-8 text-sm font-bold text-white transition-all hover:bg-white/10">
                ХАДГАЛАХ
              </button>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="mt-16 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h2 className="text-2xl font-bold text-white">Бүлгүүд</h2>
            <span className="text-sm font-medium text-zinc-500">Нийт {manga.chapters.length} бүлэг</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {manga.chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/reader/${manga.id}/${chapter.id}`}
                className="group flex items-center justify-between rounded-xl bg-zinc-900/50 p-4 border border-white/5 transition-all hover:bg-zinc-800 hover:border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 font-bold text-zinc-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    {chapter.number}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{chapter.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-zinc-600" />
                      <span className="text-[10px] uppercase tracking-wider text-zinc-600">{chapter.date}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-zinc-700 group-hover:text-primary transition-all group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
