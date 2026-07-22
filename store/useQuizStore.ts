import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Answers = {
  arc?: 'yes' | 'no';
  bank?: 'yes' | 'no';
  phone?: 'byo' | 'need';
  stay?: '1month' | '2months' | '3months' | '6months' | '1year' | 'resident';
  data?: 'light' | 'medium' | 'unlimited';
  calls?: 'minimal' | 'unlimited';
  network?: '4g' | '5g';
  tethering?: 'yes' | 'no';
  intlCalls?: 'yes' | 'no';
  simType?: 'physical' | 'esim' | 'any';
  carrier?: 'skt' | 'kt' | 'lgu' | 'mvno' | 'prepaid' | 'airport' | 'any';
  payment?: 'card' | 'bank' | 'cash';
  fullName?: string;
  nationality?: string;
  contactNum?: string;
  phoneModel?: string;
  address?: string;
  imei?: string;
  dob?: string;
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
