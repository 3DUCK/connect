import { Link } from "@/routing";
import { MessageCircle, Map as MapIcon, Languages, Train, Smartphone, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import RouteMap from "@/components/RouteMap";
import { Button } from "@/components/ui/Button";
import { AppCard } from "@/components/AppCard";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Home() {
  const t = useTranslations("Index");

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-24">
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      
      {/* Hero Section */}
      <section className="text-center mb-24">
        <div className="mb-8">
          <RouteMap />
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 whitespace-pre-wrap">
          {t("title")}
        </h1>
        <p className="text-lg md:text-xl text-ink/80 max-w-2xl mx-auto mb-10 whitespace-pre-wrap">
          {t("subtitle")}
        </p>
        <Link href="/find">
          <Button size="lg" className="font-bold text-lg gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            {t("cta")} <Smartphone size={20} />
          </Button>
        </Link>
        <p className="mt-4 text-sm text-ink/50 font-medium">
          {t("takes")}
        </p>
      </section>

      {/* The Catch-22 Section */}
      <section className="bg-ink text-paper rounded-3xl p-8 md:p-12 mb-24 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-signal/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-black mb-4">{t("catch22_title")}</h2>
            <p className="text-paper/80 mb-6 leading-relaxed">
              {t("catch22_desc")}
            </p>
            <ul className="space-y-3 font-mono text-sm">
              <li className="flex items-center gap-3 text-signal">
                <span className="w-1.5 h-1.5 rounded-full bg-signal" /> {t("catch22_no_arc")}
              </li>
              <li className="flex items-center gap-3 text-signal">
                <span className="w-1.5 h-1.5 rounded-full bg-signal" /> {t("catch22_no_card")}
              </li>
              <li className="flex items-center gap-3 text-mint">
                <span className="w-1.5 h-1.5 rounded-full bg-mint" /> {t("catch22_bypass")}
              </li>
            </ul>
          </div>
          <div className="flex justify-center">
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
              <CreditCard size={48} className="text-mint mb-4" />
              <p className="font-bold mb-1">{t("catch22_pay_title")}</p>
              <p className="text-sm text-paper/70">{t("catch22_pay_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Free App Guide Section */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-4">{t("apps_title")}</h2>
          <p className="text-ink/70">{t("apps_desc")}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <AppCard 
            name="KakaoTalk" 
            description={t("kakao_desc")}
            icon={MessageCircle}
            badge={t("essential")}
          />
          <AppCard 
            name="Naver Map" 
            description={t("naver_desc")}
            icon={MapIcon}
            badge={t("essential")}
          />
          <AppCard 
            name="Papago" 
            description={t("papago_desc")}
            icon={Languages}
          />
          <AppCard 
            name="Subway Korea" 
            description={t("subway_desc")}
            icon={Train}
          />
        </div>
      </section>

    </main>
  );
}
