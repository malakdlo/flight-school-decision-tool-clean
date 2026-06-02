import type { QuizAnswer, ResultType } from '@/types/quiz';

const resultTypes: ResultType[] = ['weekendHobbyist', 'careerCaptain', 'personalOwner', 'researchFirst'];

export function scoreQuiz(answers: QuizAnswer[]): ResultType {
  const totals = resultTypes.reduce(
    (acc, r) => { acc[r] = 0; return acc; },
    {} as Record<ResultType, number>,
  );

  for (const answer of answers) {
    for (const [key, val] of Object.entries(answer.scores)) {
      totals[key as ResultType] += val ?? 0;
    }
  }

  let maxScore = -1;
  for (const score of Object.values(totals)) {
    if (score > maxScore) maxScore = score;
  }

  const leaders = resultTypes.filter(r => totals[r] === maxScore);
  if (leaders.length === 1) return leaders[0];

  // Tie-breakers using goal, budget, medical answers
  const goalAns = answers.find(a => a.questionId === 'goal')?.value;
  const budgetAns = answers.find(a => a.questionId === 'budget')?.value;
  const medicalAns = answers.find(a => a.questionId === 'medical')?.value;

  if (leaders.includes('careerCaptain') && goalAns === 'career') return 'careerCaptain';
  if (leaders.includes('researchFirst') && (goalAns === 'unsure' || budgetAns === 'cost_concern' || medicalAns === 'concerned')) return 'researchFirst';
  if (leaders.includes('personalOwner') && goalAns === 'ownership_travel') return 'personalOwner';

  return 'weekendHobbyist';
}

export const resultRoutes: Record<ResultType, string> = {
  weekendHobbyist: '/flight-school-decision-tool/results/weekend-hobbyist/',
  careerCaptain: '/flight-school-decision-tool/results/career-captain/',
  personalOwner: '/flight-school-decision-tool/results/personal-owner/',
  researchFirst: '/flight-school-decision-tool/results/research-first/',
};
