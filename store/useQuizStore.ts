import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Answers = {
  stay?: 'short' | 'mid' | 'long';
  arc?: 'yes' | 'soon' | 'no';
  budget?: 'low' | 'mid' | 'high' | 'prem';
  data?: 'light' | 'med' | 'heavy' | 'unl';
  phone?: 'byo' | 'need';
  bank?: 'yes' | 'no';
};

interface QuizState {
  answers: Answers;
  setAnswer: (key: keyof Answers, value: string) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      answers: {},
      setAnswer: (key, value) => 
        set((state) => ({ 
          answers: { ...state.answers, [key]: value } 
        })),
      resetQuiz: () => set({ answers: {} }),
    }),
    {
      name: 'connectkr-quiz-storage',
    }
  )
);
