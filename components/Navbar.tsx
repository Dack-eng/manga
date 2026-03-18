"use client";

import Link from "next/link";
import { Search, Menu, User } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageToggle from "@/components/LanguageToggle";

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <nav className="fixed top-0 z-50 w-full glass-effect border-b border-border shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <span className="text-2xl font-bold tracking-tighter text-primary italic">MANGA</span>
            <span className="hidden text-xl font-light tracking-widest text-foreground/80 sm:block">MN</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-foreground/60 transition-colors hover:text-primary">{t('home')}</Link>
            <Link href="/browse" className="text-sm font-medium text-foreground/60 transition-colors hover:text-primary">{t('browse')}</Link>
            <Link href="/trending" className="text-sm font-medium text-foreground/60 transition-colors hover:text-primary">{t('trending')}</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <LanguageToggle />
          </div>
          <div className="relative hidden items-center sm:flex">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="h-9 w-64 rounded-full bg-muted/50 pl-10 pr-4 text-sm outline-none ring-primary/20 transition-all focus:ring-2 focus:bg-muted"
            />
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors sm:hidden">
            <Search className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <User className="h-5 w-5" />
          </button>
          <div className="md:hidden">
            <LanguageToggle />
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
