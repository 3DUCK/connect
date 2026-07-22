"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/routing";
import { Check, Lock } from "lucide-react";
import { useQuizStore } from "@/store/useQuizStore";
import { calculateRecommendation, RecommendationResult } from "@/lib/recommend";
import { Button } from "@/components/ui/Button";
import { useTranslations, useLocale } from "next-intl";

export default function ResultPage() {
  const router = useRouter();
  const t = useTranslations("Result");
  const quizT = useTranslations("Quiz");
  const locale = useLocale();
  const { answers } = useQuizStore();
  const [results, setResults] = useState<RecommendationResult[] | null>(null);
  const [livePrices, setLivePrices] = useState<Record<string, string> | null>(null);
  const [liveSpecs, setLiveSpecs] = useState<Record<string, any> | null>(null);
  const [formPlanSlug, setFormPlanSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', nationality: '', dob: '', contact: '', model: '', address: '', imei: '' });
  const formT = useTranslations("Form");

  useEffect(() => {
    // If not all answers are present, redirect to find
    if (!answers.stay || !answers.arc) {
      router.push("/find");
      return;
    }
    setResults(calculateRecommendation(answers));

    // Fetch live prices with a cache buster to bypass the stale 24-hour cache from earlier
    fetch(`/api/prices?duration=${answers.stay}&locale=${locale}&v=2`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
           setLivePrices(data.data);
           if (data.specs) setLiveSpecs(data.specs);
        }
      })
      .catch(err => console.error("Failed to fetch live prices", err));
  }, [answers, router]);

  if (!results || results.length === 0) return null;

  const primary = results[0];
  const alternatives = results.slice(1);

  const renderRecommendation = (res: RecommendationResult, isPrimary: boolean) => {
    const displayPrice = livePrices ? livePrices[res.planSlug] : null;
    const specs = liveSpecs ? liveSpecs[res.planSlug] : null;

    // While loading, we show a skeleton. Once loaded, displayPrice is used.
    const finalPrice = displayPrice || t(`plan_${res.planSlug}_price`);

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
        
        <div className="inline-flex items-center gap-2 bg-ink/5 text-ink/70 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
          ⏱️ <span>{t("based_on_stay")} : <strong className="text-ink">{quizT(`q_stay_opt_${answers.stay}`)}</strong></span>
        </div>

        <h2 className={`${isPrimary ? 'text-3xl' : 'text-xl'} font-bold mb-2 pr-20`}>{t(`plan_${res.planSlug}_name`)}</h2>
        
        {specs && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-signal/10 text-signal text-xs font-bold px-2 py-1 rounded">📡 {specs.network} {specs.data}</span>
            <span className="bg-ink/5 text-ink/80 text-xs font-bold px-2 py-1 rounded">📞 {specs.calls}</span>
            <span className="bg-ink/5 text-ink/80 text-xs font-bold px-2 py-1 rounded">💬 {specs.texts}</span>
            {specs.contract && (
              <span className="bg-ink/5 text-ink/80 text-xs font-bold px-2 py-1 rounded">📝 {specs.contract}</span>
            )}
          </div>
        )}

        <div className={`${isPrimary ? 'text-2xl' : 'text-lg'} font-mono text-signal mb-4 min-h-[32px] flex items-center`}>
          {livePrices ? finalPrice : (
            <span className="inline-block w-32 h-6 bg-signal/10 rounded animate-pulse" />
          )}
        </div>

        <div className="bg-signal/5 border border-signal/20 p-4 rounded-xl mb-6">
          <p className="text-sm text-ink/80 leading-relaxed font-medium">
            {isPrimary 
              ? t("dynamic_meaning_primary") 
              : t("dynamic_meaning_alt")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <div className="flex items-center gap-3 text-sm font-medium bg-ink/5 px-3 py-2 rounded-lg inline-flex">
            <span className="text-ink/60">{t("difficulty")}</span>
            <span className="uppercase tracking-wider text-ink font-bold">{t(`diff_${res.difficulty}` as any)}</span>
          </div>

          {res.planSlug !== 'esim' && (
            <>
              <Button 
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  if (res.planSlug === 'prepaid_airport') {
                    window.open('https://map.naver.com/v5/search/인천공항 통신사 로밍센터', '_blank');
                  } else if (res.planSlug === 'major') {
                    window.open('https://map.naver.com/v5/search/휴대폰 대리점', '_blank');
                  } else {
                    window.open('https://map.naver.com/v5/search/알뜰폰 대리점', '_blank');
                  }
                }}
              >
                📍 {t("find_agency")}
              </Button>
              <Button 
                size="sm"
                className="gap-2 bg-signal/10 text-signal hover:bg-signal/20 border-0"
                onClick={() => setFormPlanSlug(res.planSlug)}
              >
                📄 {t("generate_sheet")} [DEV 무과금 보기]
              </Button>
            </>
          )}
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
      <div className="relative rounded-3xl border border-ink/10 bg-white p-8 overflow-hidden shadow-sm mt-12">
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

      {/* FORM MODAL */}
      {formPlanSlug && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-2">{formT("title")}</h2>
            <p className="text-sm text-ink/60 mb-6">{formT("desc")}</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              useQuizStore.getState().setAnswer('fullName', formData.name);
              useQuizStore.getState().setAnswer('nationality', formData.nationality);
              useQuizStore.getState().setAnswer('dob', formData.dob);
              useQuizStore.getState().setAnswer('contactNum', formData.contact);
              useQuizStore.getState().setAnswer('phoneModel', formData.model);
              useQuizStore.getState().setAnswer('address', formData.address);
              useQuizStore.getState().setAnswer('imei', formData.imei);
              router.push(`/sheet?plan=${formPlanSlug}`);
            }} className="space-y-4">
              
              <div>
                <label className="block text-sm font-bold text-ink/80 mb-1">{formT("name")}</label>
                <input 
                  type="text" required
                  className="w-full p-3 rounded-xl border border-ink/20 focus:border-signal outline-none"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-ink/80 mb-1">{formT("nationality")}</label>
                <input 
                  type="text" required
                  className="w-full p-3 rounded-xl border border-ink/20 focus:border-signal outline-none"
                  value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-ink/80 mb-1">{formT("dob")}</label>
                <input 
                  type="text" required placeholder="1990-01-01"
                  className="w-full p-3 rounded-xl border border-ink/20 focus:border-signal outline-none"
                  value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-ink/80 mb-1">{formT("contact")}</label>
                <input 
                  type="text" required
                  className="w-full p-3 rounded-xl border border-ink/20 focus:border-signal outline-none"
                  value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-ink/80 mb-1">{formT("model")}</label>
                <input 
                  type="text" required
                  className="w-full p-3 rounded-xl border border-ink/20 focus:border-signal outline-none"
                  value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-ink/80 mb-1">{formT("address")} <span className="text-ink/40 font-normal text-xs">(Optional)</span></label>
                <input 
                  type="text"
                  className="w-full p-3 rounded-xl border border-ink/20 focus:border-signal outline-none"
                  value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-ink/80 mb-1">{formT("imei")} <span className="text-ink/40 font-normal text-xs">(Optional)</span></label>
                <input 
                  type="text"
                  className="w-full p-3 rounded-xl border border-ink/20 focus:border-signal outline-none"
                  value={formData.imei} onChange={e => setFormData({...formData, imei: e.target.value})}
                />
              </div>

              <div className="flex gap-3 mt-8 pt-4 border-t border-ink/10">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setFormPlanSlug(null)}>
                  {formT("cancel")}
                </Button>
                <Button type="submit" className="flex-1 bg-signal text-white">
                  {formT("submit")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
