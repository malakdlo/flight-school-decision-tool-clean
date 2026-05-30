import type { QuizQuestion } from '@/types/quiz';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'goal',
    question: 'What is your primary goal for aviation?',
    subtext: 'This helps us determine which pilot path is the best fit.',
    options: [
      {
        id: 'major-airline',
        label: 'Fly for a major airline',
        scores: { career: 5, explorer: 1 },
      },
      {
        id: 'private-fun-travel',
        label: 'Fly privately for fun/travel',
        scores: { hobbyist: 5, owner: 1 },
      },
      {
        id: 'business-aircraft',
        label: 'Own or use an aircraft for business/travel',
        scores: { owner: 5, hobbyist: 1 },
      },
      {
        id: 'not-sure',
        label: 'Not sure yet',
        scores: { explorer: 5 },
      },
    ],
  },
  {
    id: 'concern',
    question: 'What is your biggest concern right now?',
    subtext: "We'll address this in your personalized roadmap.",
    options: [
      {
        id: 'cost',
        label: 'The total cost',
        scores: { hobbyist: 2, explorer: 2 },
      },
      {
        id: 'time',
        label: 'Time commitment',
        scores: { hobbyist: 2, owner: 1 },
      },
      {
        id: 'medical',
        label: 'Medical eligibility',
        scores: { explorer: 3 },
      },
      {
        id: 'difficulty',
        label: 'Fear of the difficulty/math',
        scores: { explorer: 2, hobbyist: 1 },
      },
    ],
  },
  {
    id: 'weekly-time',
    question: 'How much time can you commit weekly?',
    subtext: 'Training frequency has a major impact on cost and timeline.',
    options: [
      {
        id: 'full-time',
        label: 'Full-time (4-5 days)',
        scores: { career: 4 },
      },
      {
        id: 'part-time',
        label: 'Part-time (2-3 days)',
        scores: { career: 2, hobbyist: 2, owner: 2 },
      },
      {
        id: 'weekends-only',
        label: 'Weekends only',
        scores: { hobbyist: 4, owner: 1 },
      },
      {
        id: 'occasionally',
        label: 'Occasionally',
        scores: { explorer: 3, hobbyist: 1 },
      },
    ],
  },
  {
    id: 'budget',
    question: 'What is your investment comfort level?',
    subtext: 'This helps us identify financing or pay-as-you-go paths.',
    options: [
      {
        id: 'under-15k',
        label: 'Under $15,000',
        scores: { hobbyist: 3, explorer: 2 },
      },
      {
        id: '15k-50k',
        label: '$15,000 - $50,000',
        scores: { hobbyist: 3, owner: 1 },
      },
      {
        id: '50k-100k',
        label: '$50,000 - $100,000',
        scores: { career: 4, owner: 2 },
      },
      {
        id: 'whatever-it-takes',
        label: 'Whatever it takes',
        scores: { career: 4, owner: 3 },
      },
    ],
  },
  {
    id: 'timeline',
    question: 'What is your desired timeline?',
    subtext: 'When do you want to have your first license in hand?',
    options: [
      {
        id: 'under-6-months',
        label: 'ASAP (Under 6 months)',
        scores: { career: 3, owner: 1 },
      },
      {
        id: '12-months',
        label: '12 months',
        scores: { career: 2, hobbyist: 2, owner: 2 },
      },
      {
        id: '2-years',
        label: '2 years',
        scores: { hobbyist: 3, owner: 2 },
      },
      {
        id: 'no-rush',
        label: 'No rush',
        scores: { hobbyist: 2, explorer: 2 },
      },
    ],
  },
  {
    id: 'medical',
    question: 'Do you have any medical concerns?',
    subtext: 'FAA medical eligibility can affect the best first step.',
    options: [
      {
        id: 'none',
        label: 'None',
        scores: { career: 1, hobbyist: 1, owner: 1 },
      },
      {
        id: 'vision-only',
        label: 'Corrective vision only',
        scores: { career: 1, hobbyist: 1, owner: 1 },
      },
      {
        id: 'specific-condition',
        label: 'A specific condition',
        scores: { explorer: 4 },
      },
      {
        id: 'dont-know',
        label: "I don't know the requirements",
        scores: { explorer: 3 },
      },
    ],
  },
];
