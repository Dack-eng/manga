"use client";
export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import MangaCard from "@/components/MangaCard";
import { Zap, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { getAllManga } from "@/lib/data";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();
  const [trendingManga, setTrendingManga] = useState<any[]>([]);
  const [featuredManga, setFeaturedManga] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/manga");
        const mangaData = await response.json();
        const trending = mangaData.slice(0, 6) || [];
        setTrendingManga(trending);
        setFeaturedManga(trending.length > 0 ? trending[0] : null);
      } catch (error) {
        console.error("Data fetching error:", error);
      }
    }
    fetchData();
  }, []);
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
                    <span>{t('featuredManga')}</span>
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
                    {featuredManga?.title ? featuredManga.title.split(' ')[0] : "MANGA"} <br />
                    <span className="text-primary">{featuredManga?.title ? featuredManga.title.split(' ').slice(1).join(' ') : "MN"}</span>
                  </h1>
                  <p className="max-w-md text-lg text-zinc-400">
                    {featuredManga?.description ? featuredManga.description.slice(0, 150) : t('footerDesc')}...
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {featuredManga && (
                      <Link href={`/manga/${featuredManga.slug}`} className="h-12 flex items-center rounded-xl bg-primary px-8 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                        {t('startReading')}
                      </Link>
                    )}
                    <button className="h-12 rounded-xl bg-white/5 border border-white/10 px-8 text-sm font-bold text-white transition-all hover:bg-white/10">
                      {t('details')}
                    </button>
                  </div>
                </div>
                <div className="hidden md:block relative h-[400px] w-full">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    {featuredManga?.cover ? (
                      <img 
                        src={featuredManga.cover} 
                        className="w-full h-full object-cover" 
                        alt={featuredManga.title} 
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800" />
                    )}
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
                <h2 className="text-2xl font-bold tracking-tight text-foreground">{t('trendingManga')}</h2>
              </div>
              <button className="text-sm font-semibold text-primary hover:underline transition-all">{t('viewAll')}</button>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {trendingManga.map((manga) => (
                <MangaCard key={manga.id} id={manga.slug} title={manga.title} cover={manga.cover} rating={manga.rating} chapters={manga.chapters_count} category={manga.category} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-muted/30 py-12 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <div className="text-2xl font-bold tracking-tighter text-primary mb-4 italic uppercase">MANGA {useLanguage().language}</div>
          <p className="text-sm text-zinc-500 mb-6">{t('footerDesc')}</p>
          <div className="flex justify-center gap-8 text-xs font-medium text-zinc-400">
            <a href="#" className="hover:text-primary">{t('aboutUs')}</a>
            <a href="#" className="hover:text-primary">{t('contactUs')}</a>
            <a href="#" className="hover:text-primary">{t('privacy')}</a>
          </div>
          <div className="mt-8 text-[10px] text-zinc-600">© 2026 MANGA {useLanguage().language.toUpperCase()}. {t('copyright')}</div>
        </div>
      </footer>
    </div>
  );
}
