import Navbar from "@/components/Navbar";
import MangaCard from "@/components/MangaCard";
import { Zap, TrendingUp, Sparkles } from "lucide-react";

const TRENDING_MANGA = [
  {
    id: "sky-boxer",
    title: "Тэнгэрийн Боксчин (Sky Boxer)",
    cover: "/covers/sky-boxer.png",
    rating: 4.9,
    chapters: 124,
    category: "Action",
  },
  {
    id: "shadow-blade",
    title: "Сүүдрийн Ир (Shadow Blade)",
    cover: "/covers/shadow-blade.png",
    rating: 4.8,
    chapters: 86,
    category: "Adventure",
  },
  {
    id: "urban-mage",
    title: "Хотын Шидтэн (Urban Mage)",
    cover: "/covers/urban-mage.png",
    rating: 4.7,
    chapters: 45,
    category: "Fantasy",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 mb-16">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/5 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/10 opacity-50" />
              <div className="relative z-10 grid gap-8 p-8 md:grid-cols-2 md:p-16 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm border border-white/10">
                    <Sparkles className="h-3 w-3" />
                    <span>ОНЦЛОХ МАНГА</span>
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
                    Тэнгэрийн <br />
                    <span className="text-primary">Боксчин</span>
                  </h1>
                  <p className="max-w-md text-lg text-zinc-400">
                    Хамгийн сүүлийн үеийн бүлэг болох 124-р бүлэг одоо бэлэн боллоо. Ширүүн тулаан, гайхалтай түүхийг бүү алдаарай.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button className="h-12 rounded-xl bg-primary px-8 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                      УНШИЖ ЭХЛЭХ
                    </button>
                    <button className="h-12 rounded-xl bg-white/5 border border-white/10 px-8 text-sm font-bold text-white transition-all hover:bg-white/10">
                      ДЭЛГЭРЭНГҮЙ
                    </button>
                  </div>
                </div>
                <div className="hidden md:block relative h-[400px] w-full">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <img src="/covers/sky-boxer.png" className="w-full h-full object-cover" alt="Sky Boxer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Трэнд Манга</h2>
              </div>
              <button className="text-sm font-semibold text-primary hover:underline transition-all">Бүгдийг харах</button>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {TRENDING_MANGA.map((manga) => (
                <MangaCard key={manga.id} {...manga} />
              ))}
              {/* Duplicate cards to fill the Grid for visual effect */}
              {TRENDING_MANGA.map((manga) => (
                <MangaCard key={`${manga.id}-2`} {...manga} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-muted/30 py-12 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <div className="text-2xl font-bold tracking-tighter text-primary mb-4 italic">MANGA MN</div>
          <p className="text-sm text-zinc-500 mb-6">Хамгийн том монгол манга унших платформ.</p>
          <div className="flex justify-center gap-8 text-xs font-medium text-zinc-400">
            <a href="#" className="hover:text-primary">Бидний тухай</a>
            <a href="#" className="hover:text-primary">Холбоо барих</a>
            <a href="#" className="hover:text-primary">Нууцлал</a>
          </div>
          <div className="mt-8 text-[10px] text-zinc-600">© 2026 MANGA MN. Бүх эрх хуулиар хамгаалагдсан.</div>
        </div>
      </footer>
    </div>
  );
}
