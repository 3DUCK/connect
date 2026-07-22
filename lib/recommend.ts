import { Answers } from '@/store/useQuizStore';

export type PlanSlug = 'esim' | 'prepaid' | 'major_device' | 'major_sim' | 'mvno';

export interface RecommendationResult {
  planSlug: PlanSlug;
  difficulty: 'very-easy' | 'easy' | 'medium';
}

export function calculateRecommendation(answers: Answers): RecommendationResult[] {
  const { arc, stay, data, phone, budget } = answers;
  let primary: PlanSlug = 'mvno';
  
  // Logic for Primary Recommendation
  if ((arc === 'no' || arc === 'soon') && stay === 'short') {
    primary = 'esim';
  } else if ((arc === 'no' || arc === 'soon') && (stay === 'mid' || stay === 'long')) {
    primary = 'prepaid';
  } else if (arc === 'yes' && phone === 'need') {
    primary = 'major_device';
  } else if (arc === 'yes' && phone === 'byo' && (budget === 'high' || budget === 'prem') && (data === 'heavy' || data === 'unl')) {
    primary = 'major_sim';
  } else {
    primary = 'mvno';
  }

  // Map to select 2 alternative plans based on the primary choice
  const alternativesMap: Record<PlanSlug, PlanSlug[]> = {
    'esim': ['prepaid', 'mvno'],
    'prepaid': ['esim', 'mvno'],
    'major_device': ['major_sim', 'mvno'],
    'major_sim': ['mvno', 'major_device'],
    'mvno': ['major_sim', 'prepaid']
  };

  const difficulties: Record<PlanSlug, 'very-easy' | 'easy' | 'medium'> = {
    'esim': 'very-easy',
    'prepaid': 'easy',
    'major_device': 'medium',
    'major_sim': 'medium',
    'mvno': 'easy'
  };

  const results: RecommendationResult[] = [
    { planSlug: primary, difficulty: difficulties[primary] },
    { planSlug: alternativesMap[primary][0], difficulty: difficulties[alternativesMap[primary][0]] },
    { planSlug: alternativesMap[primary][1], difficulty: difficulties[alternativesMap[primary][1]] },
  ];

  return results;
}
