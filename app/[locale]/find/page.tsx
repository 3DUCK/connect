"use client";

import { useState } from "react";
import { useRouter } from "@/routing";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore, Answers } from "@/store/useQuizStore";
import { Button } from "@/components/ui/Button";

type Question = {
  id: keyof Answers;
  title: string;
  options: { label: string; value: string; desc?: string }[];
};

import { useTranslations } from "next-intl";

export default function QuizPage() {
  const router = useRouter();
  const t = useTranslations("Quiz");
  const { answers, setAnswer } = useQuizStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const QUESTIONS: Question[] = [
    {
      id: "arc",
      title: t("q_arc_title"),
      options: [
        { label: t("q_arc_opt1"), value: "yes" },
        { label: t("q_arc_opt3"), value: "no" },
      ]
    },
    {
      id: "bank",
      title: t("q_bank_title"),
      options: [
        { label: t("q_bank_opt1"), value: "yes" },
        { label: t("q_bank_opt2"), value: "no", desc: t("q_bank_desc2") },
      ]
    },
    {
      id: "phone",
      title: t("q_phone_title"),
      options: [
        { label: t("q_phone_opt1"), value: "byo" },
        { label: t("q_phone_opt2"), value: "need" },
      ]
    },
    {
      id: "stay",
      title: t("q_stay_title"),
      options: [
        { label: t("q_stay_opt_1month"), value: "1month", desc: t("q_stay_desc_1month") },
        { label: t("q_stay_opt_2months"), value: "2months", desc: t("q_stay_desc_2months") },
        { label: t("q_stay_opt_3months"), value: "3months", desc: t("q_stay_desc_3months") },
        { label: t("q_stay_opt_6months"), value: "6months", desc: t("q_stay_desc_6months") },
        { label: t("q_stay_opt_1year"), value: "1year", desc: t("q_stay_desc_1year") },
        { label: t("q_stay_opt_resident"), value: "resident", desc: t("q_stay_desc_resident") },
      ]
    },
    {
      id: "data",
      title: t("q_data_title"),
      options: [
        { label: t("q_data_opt1"), value: "light", desc: t("q_data_desc1") },
        { label: t("q_data_opt2"), value: "medium", desc: t("q_data_desc2") },
        { label: t("q_data_opt3"), value: "unlimited", desc: t("q_data_desc3") },
      ]
    },
    {
      id: "calls",
      title: t("q_calls_title"),
      options: [
        { label: t("q_calls_opt1"), value: "minimal", desc: t("q_calls_desc1") },
        { label: t("q_calls_opt2"), value: "unlimited", desc: t("q_calls_desc2") },
      ]
    },
    {
      id: "network",
      title: t("q_network_title"),
      options: [
        { label: t("q_network_opt1"), value: "4g", desc: t("q_network_desc1") },
        { label: t("q_network_opt2"), value: "5g", desc: t("q_network_desc2") },
      ]
    },
    {
      id: "tethering",
      title: t("q_tethering_title"),
      options: [
        { label: t("q_tethering_opt1"), value: "yes", desc: t("q_tethering_desc1") },
        { label: t("q_tethering_opt2"), value: "no", desc: t("q_tethering_desc2") },
      ]
    },
    {
      id: "intlCalls",
      title: t("q_intl_title"),
      options: [
        { label: t("q_intl_opt1"), value: "yes", desc: t("q_intl_desc1") },
        { label: t("q_intl_opt2"), value: "no", desc: t("q_intl_desc2") },
      ]
    },
    {
      id: "simType",
      title: t("q_sim_title"),
      options: [
        { label: t("q_sim_opt1"), value: "physical", desc: t("q_sim_desc1") },
        { label: t("q_sim_opt2"), value: "esim", desc: t("q_sim_desc2") },
        { label: t("q_sim_opt3"), value: "any", desc: t("q_sim_desc3") },
      ]
    },
    {
      id: "carrier",
      title: t("q_carrier_title"),
      options: [
        { label: t("q_carrier_opt1"), value: "skt", desc: t("q_carrier_desc1") },
        { label: t("q_carrier_opt2"), value: "kt", desc: t("q_carrier_desc2") },
        { label: t("q_carrier_opt3"), value: "lgu", desc: t("q_carrier_desc3") },
        { label: t("q_carrier_opt_mvno"), value: "mvno", desc: t("q_carrier_desc_mvno") },
        { label: t("q_carrier_opt_prepaid"), value: "prepaid", desc: t("q_carrier_desc_prepaid") },
        { label: t("q_carrier_opt_airport"), value: "airport", desc: t("q_carrier_desc_airport") },
        { label: t("q_carrier_opt4"), value: "any", desc: t("q_carrier_desc4") },
      ]
    },
    {
      id: "payment",
      title: t("q_payment_title"),
      options: [
        { label: t("q_payment_opt1"), value: "card", desc: t("q_payment_desc1") },
        { label: t("q_payment_opt2"), value: "bank", desc: t("q_payment_desc2") },
        { label: t("q_payment_opt3"), value: "cash", desc: t("q_payment_desc3") },
      ]
    }
  ];

  const question = QUESTIONS[currentIndex];
  const progress = ((currentIndex) / QUESTIONS.length) * 100;

  if (!question) return null;

  const handleSelect = (value: string) => {
    setAnswer(question.id, value);
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.push("/result");
    }
  };

  return (
    <main className="flex-1 w-full max-w-xl mx-auto px-6 py-12 flex flex-col justify-center">
      
      {/* Progress Bar */}
      <div className="w-full bg-ink/10 h-2 rounded-full mb-12 overflow-hidden">
        <motion.div 
          className="h-full bg-signal"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-6"
        >
          <h2 className="text-3xl font-black mb-4 leading-tight">
            {question.title}
          </h2>
          
          <div className="flex flex-col gap-4">
            {question.options.map((opt) => {
              const isSelected = answers[question.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`
                    p-6 rounded-2xl text-left transition-all border-2 
                    ${isSelected 
                      ? "border-signal bg-signal/5 shadow-md" 
                      : "border-ink/10 bg-white hover:border-signal/50 hover:bg-signal/5"
                    }
                  `}
                >
                  <p className="font-bold text-lg">{opt.label}</p>
                  {opt.desc && <p className="text-ink/60 text-sm mt-1">{opt.desc}</p>}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
      
      {currentIndex > 0 && (
        <div className="mt-12 text-center">
          <Button variant="ghost" onClick={() => setCurrentIndex(prev => prev - 1)}>
            ← {t("back")}
          </Button>
        </div>
      )}
    </main>
  );
}
