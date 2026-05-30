export type ResultType = 'hobbyist' | 'career' | 'owner' | 'explorer';

export type QuizOption = {
  id: string;
  label: string;
  scores: Partial<Record<ResultType, number>>;
};

export type QuizQuestion = {
  id: string;
  question: string;
  subtext: string;
  options: QuizOption[];
};

export type QuizAnswer = {
  questionId: string;
  optionId: string;
};

export type ResultStat = {
  label: string;
  value: string;
  note: string;
  variant?: 'dark' | 'light';
};

export type ResultPath = {
  id: ResultType;
  eyebrow: string;
  title: string;
  description: string;
  stats: ResultStat[];
  fitReasons: string[];
  firstSteps: Array<{
    title: string;
    description: string;
    linkLabel?: string;
    href?: string;
  }>;
};
