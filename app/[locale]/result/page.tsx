"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/routing";
import { Check, Lock } from "lucide-react";
import { useQuizStore } from "@/store/useQuizStore";
import { calculateRecommendation, RecommendationResult } from "@/lib/recommend";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export default function ResultPage() {
  const router = useRouter();
  const t = useTranslations("Result");
  const { answers } = useQuizStore();
  const [results, setResults] = useState<RecommendationResult[] | null>(null);

  useEffect(() => {
    // If not all answers are present, redirect to find
    if (!answers.stay || !answers.arc || !answers.budget) {
      router.push("/find");
      return;
    }
    setResults(calculateRecommendation(answers));
  }, [answers, router]);

  if (!results || results.length === 0) return null;

  const primary = results[0];
  const alternatives = results.slice(1);

  const renderRecommendation = (res: RecommendationResult, isPrimary: boolean) => {
    const whyKeys = [1, 2, 3];

    return (
      <div key={res.planSlug} className={`bg-white rounded-3xl p-6 md:p-8 border-4 ${isPrimary ? 'border-signal/20 shadow-xl' : 'border-ink/5 shadow-md mt-6'} relative overflow-hidden`}>
        {isPrimary ? (
          <div className="absolute top-0 right-0 bg-signal text-white font-bold px-4 py-1 rounded-bl-xl text-sm">
            {t("best_fit")}
          </div>
        ) : (
          <div className="absolute top-0 right-0 bg-ink/10 text-ink/60 font-bold px-4 py-1 rounded-bl-xl text-xs">
            {t("alternative")}
          </div>
        )}
        
        <h2 className={`${isPrimary ? 'text-3xl' : 'text-xl'} font-bold mb-2 pr-20`}>{t(`plan_${res.planSlug}_name`)}</h2>
        <p className={`${isPrimary ? 'text-2xl' : 'text-lg'} font-mono text-signal mb-6`}>{t(`plan_${res.planSlug}_price`)}</p>

        <h3 className="font-bold text-sm text-ink/60 mb-3 uppercase tracking-wider">{t("why_recommend")}</h3>
        <ul className="space-y-3 mb-6">
          {whyKeys.map(key => {
            const whyText = t(`plan_${res.planSlug}_why${key}` as any);
            if (!whyText) return null;
            return (
              <li key={key} className="flex items-start gap-3">
                <div className="bg-mint/50 p-1 rounded-full mt-0.5 text-ink shrink-0">
                  <Check size={14} />
                </div>
                <span className={`${isPrimary ? 'text-ink/80' : 'text-ink/70 text-sm'} leading-relaxed`}>{whyText}</span>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3 text-sm font-medium bg-ink/5 px-3 py-2 rounded-lg inline-flex">
          <span className="text-ink/60">{t("difficulty")}</span>
          <span className="uppercase tracking-wider text-ink font-bold">{t(`diff_${res.difficulty}` as any)}</span>
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black mb-4">{t("title")}</h1>
        <p className="text-xl text-ink/70">{t("subtitle")}</p>
      </div>

      {renderRecommendation(primary, true)}

      <div className="mt-8 mb-12 flex flex-col gap-4">
        {alternatives.map(alt => renderRecommendation(alt, false))}
      </div>

      {/* PAYWALL SECTION */}
      <div className="relative rounded-3xl border border-ink/10 bg-white p-8 overflow-hidden shadow-sm">
        <div className="blur-sm opacity-40 select-none pointer-events-none">
          <h3 className="text-2xl font-bold mb-6">{t("paywall_title")}</h3>
          <div className="space-y-4">
            <div className="h-12 bg-ink/10 rounded-xl" />
            <div className="h-24 bg-ink/5 rounded-xl" />
            <div className="h-12 bg-ink/10 rounded-xl" />
          </div>
          <h3 className="text-2xl font-bold mt-10 mb-6">{t("paywall_docs")}</h3>
          <div className="space-y-2">
            <div className="h-8 bg-ink/5 w-1/2 rounded" />
            <div className="h-8 bg-ink/5 w-2/3 rounded" />
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-white via-white/90 to-transparent">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-ink/5 mt-20">
            <div className="bg-signal text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-signal/30">
              <Lock size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3">{t("unlock_title")}</h3>
            <p className="text-ink/70 mb-6 text-sm md:text-base">
              {t("unlock_desc")}
            </p>
            <div className="text-3xl font-black font-mono mb-8 text-signal">
              {t("unlock_price")}
              <span className="text-sm text-ink/50 font-sans font-normal block mt-1">{t("unlock_sub")}</span>
            </div>
            <Button 
              size="lg" 
              className="w-full text-lg mb-4 h-14"
              onClick={() => router.push("/checkout")}
            >
              {t("unlock_btn")}
            </Button>
            <p className="text-xs text-ink/50 leading-relaxed max-w-xs mx-auto">
              {t("unlock_secure")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
