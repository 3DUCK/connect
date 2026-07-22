"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/routing";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const languages = [
  { code: "en", name: "English" },
  { code: "ko", name: "한국어" },
  { code: "zh", name: "中文 (简体)" },
  { code: "fr", name: "Français" },
  { code: "ja", name: "日本語" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    setIsOpen(false);
    router.replace(pathname, { locale: code });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-ink/10 shadow-sm transition-all hover:bg-white hover:shadow-md hover:border-signal/30 text-sm font-bold text-ink focus:outline-none"
      >
        <Globe size={18} className="text-signal" />
        <span>{currentLang.name}</span>
        <ChevronDown size={16} className={`text-ink/50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-ink/10 overflow-hidden z-50 transition-all origin-top-right">
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-colors hover:bg-signal/5 focus:outline-none ${
                  locale === lang.code ? "text-signal bg-signal/10" : "text-ink/70 hover:text-ink"
                }`}
              >
                {lang.name}
                {locale === lang.code && <Check size={18} className="text-signal" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
