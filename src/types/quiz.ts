export type ResultType = 'weekendHobbyist' | 'careerCaptain' | 'personalOwner' | 'researchFirst';

export type QuizOption = {
  value: string;
  label: string;
  scores: Partial<Record<ResultType, number>>;
};

export type QuizQuestion = {
  id: string;
  text: string;
  options: QuizOption[];
};

export type QuizAnswer = {
  questionId: string;
  value: string;
  scores: Partial<Record<ResultType, number>>;
};
