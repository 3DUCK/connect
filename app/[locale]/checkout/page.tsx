"use client";

import { useState } from "react";
import { CreditCard, Bug } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export default function CheckoutPage() {
  const t = useTranslations("Checkout");
  const [email, setEmail] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTitleClick = () => {
    setClickCount(prev => prev + 1);
  };

  const handlePayment = () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    // Redirect to Gumroad with email pre-filled
    const gumroadUrl = `https://kermitsong51.gumroad.com/l/korea-phone-guide-dao?email=${encodeURIComponent(email)}`;
    window.location.href = gumroadUrl;
  };

  const handleBackdoor = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/backdoor-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        alert(t("success"));
      } else {
        alert("Failed to send email");
      }
    } catch (e) {
      console.error(e);
      alert("Error sending email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-ink/5 relative overflow-hidden">
        
        <div 
          className="flex items-center gap-3 mb-8 pb-6 border-b border-ink/10 cursor-pointer"
          onClick={handleTitleClick}
        >
          <CreditCard size={28} className="text-signal" />
          <h1 className="text-2xl font-black select-none">
            {t("title")}
          </h1>
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-ink/5 p-4 rounded-xl flex justify-between items-center font-bold">
            <span>{t("item_name")}</span>
            <span className="text-signal">{t("item_price")}</span>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-ink/80">{t("email_label")}</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email_placeholder")}
              className="w-full bg-ink/5 border-none rounded-xl p-4 text-ink placeholder:text-ink/30 focus:ring-2 focus:ring-signal outline-none transition-all"
            />
          </div>
        </div>

        <Button 
          size="lg" 
          className="w-full text-lg h-14 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 mb-4"
          onClick={handlePayment}
          disabled={!email || loading}
        >
          <CreditCard size={20} />
          Proceed to Checkout
        </Button>

        {clickCount >= 5 && (
          <Button 
            size="lg" 
            variant="outline"
            className="w-full text-lg h-14 text-signal border-signal/20 bg-signal/5 hover:bg-signal/10 flex items-center justify-center gap-2"
            onClick={handleBackdoor}
            disabled={!email || loading}
          >
            <Bug size={20} />
            {loading ? t("processing") : t("dev_bypass")}
          </Button>
        )}

        <p className="text-center text-xs text-ink/50 mt-6 leading-relaxed">
          {t("info")}
        </p>

      </div>
    </main>
  );
}
