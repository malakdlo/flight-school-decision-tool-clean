import { quizQuestions } from '@/data/quizQuestions';
import type { QuizAnswer, ResultType } from '@/types/quiz';

const resultTypes: ResultType[] = ['hobbyist', 'career', 'owner', 'explorer'];

export function scoreQuiz(answers: QuizAnswer[]): ResultType {
  const totals = resultTypes.reduce(
    (acc, resultType) => {
      acc[resultType] = 0;
      return acc;
    },
    {} as Record<ResultType, number>,
  );

  for (const answer of answers) {
    const question = quizQuestions.find((item) => item.id === answer.questionId);
    const option = question?.options.find((item) => item.id === answer.optionId);

    if (!option) continue;

    for (const [resultType, points] of Object.entries(option.scores)) {
      totals[resultType as ResultType] += points ?? 0;
    }
  }

  const sorted = [...resultTypes].sort((a, b) => totals[b] - totals[a]);
  const top = sorted[0];
  const second = sorted[1];

  // Tie-breaker: if the first question shows a clear goal, respect it.
  if (totals[top] === totals[second]) {
    const goalAnswer = answers.find((answer) => answer.questionId === 'goal');
    if (goalAnswer?.optionId === 'major-airline') return 'career';
    if (goalAnswer?.optionId === 'private-fun-travel') return 'hobbyist';
    if (goalAnswer?.optionId === 'business-aircraft') return 'owner';
    return 'explorer';
  }

  return top;
}
