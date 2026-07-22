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
      id: "stay",
      title: t("q_stay_title"),
      options: [
        { label: t("q_stay_opt1"), value: "short", desc: t("q_stay_desc1") },
        { label: t("q_stay_opt2"), value: "mid", desc: t("q_stay_desc2") },
        { label: t("q_stay_opt3"), value: "long", desc: t("q_stay_desc3") },
      ]
    },
    {
      id: "arc",
      title: t("q_arc_title"),
      options: [
        { label: t("q_arc_opt1"), value: "yes" },
        { label: t("q_arc_opt2"), value: "soon", desc: t("q_arc_desc2") },
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
      id: "data",
      title: t("q_data_title"),
      options: [
        { label: t("q_data_opt1"), value: "light" },
        { label: t("q_data_opt2"), value: "med" },
        { label: t("q_data_opt3"), value: "heavy" },
        { label: t("q_data_opt4"), value: "unl" },
      ]
    },
    {
      id: "budget",
      title: t("q_budget_title"),
      options: [
        { label: t("q_budget_opt1"), value: "low" },
        { label: t("q_budget_opt2"), value: "mid" },
        { label: t("q_budget_opt3"), value: "high" },
        { label: t("q_budget_opt4"), value: "prem" },
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
