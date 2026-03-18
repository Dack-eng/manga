"use client";

import { useLanguage } from "./LanguageProvider";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full bg-muted/50 p-1 border border-border/50 backdrop-blur-sm">
      <button
        onClick={() => setLanguage("mn")}
        className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
          language === "mn"
            ? "bg-primary text-primary-foreground shadow-lg scale-105"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        MN
      </button>
      <button
        onClick={() => setLanguage("jp")}
        className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
          language === "jp"
            ? "bg-primary text-primary-foreground shadow-lg scale-105"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        JP
      </button>
      <div className="flex items-center justify-center p-1 text-muted-foreground ml-1">
        <Globe className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}
