import { Answers } from '@/store/useQuizStore';

export type PlanSlug = 'prepaid_airport' | 'prepaid_online' | 'mvno' | 'major' | 'esim';

export interface RecommendationResult {
  planSlug: PlanSlug;
  difficulty: 'very-easy' | 'easy' | 'medium';
}

export function calculateRecommendation(answers: Answers): RecommendationResult[] {
  const { arc, bank, phone, stay } = answers;
  let primary: PlanSlug = 'mvno';
  
  // New logic matching the diagnostic tree
  if (stay === '1month' || stay === '2months' || stay === '3months') {
    // Short term stays (< 6 months) shouldn't do postpaid
    primary = 'prepaid_online';
  } else if (arc === 'no') {
    // If stay is >= 6 months but no ARC yet
    primary = 'prepaid_online';
  } else if (arc === 'yes' && bank === 'no') {
    // Has ARC but no bank -> Needs bank first, but can do prepaid in the meantime
    primary = 'prepaid_online';
  } else if (arc === 'yes' && bank === 'yes') {
    if (phone === 'need') {
      primary = 'major';
    } else {
      primary = 'mvno';
    }
  }

  // Map to select 2 alternative plans based on the primary choice
  const alternativesMap: Record<PlanSlug, PlanSlug[]> = {
    'prepaid_airport': ['esim', 'prepaid_online'],
    'prepaid_online': ['prepaid_airport', 'esim'],
    'mvno': ['major', 'prepaid_online'],
    'major': ['mvno', 'prepaid_online'],
    'esim': ['prepaid_airport', 'prepaid_online']
  };

  const difficulties: Record<PlanSlug, 'very-easy' | 'easy' | 'medium'> = {
    'prepaid_airport': 'very-easy',
    'prepaid_online': 'easy',
    'mvno': 'medium',
    'major': 'medium',
    'esim': 'very-easy'
  };

  const results: RecommendationResult[] = [
    { planSlug: primary, difficulty: difficulties[primary] },
    { planSlug: alternativesMap[primary][0], difficulty: difficulties[alternativesMap[primary][0]] },
    { planSlug: alternativesMap[primary][1], difficulty: difficulties[alternativesMap[primary][1]] },
  ];

  return results;
}

