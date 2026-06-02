import type { QuizQuestion } from '@/types/quiz';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'goal',
    text: 'What best describes why you want to fly?',
    options: [
      { value: 'hobby', label: 'Fly for fun, personal growth, or local adventures', scores: { weekendHobbyist: 3 } },
      { value: 'career', label: 'Become a professional pilot or explore an airline/commercial career', scores: { careerCaptain: 4 } },
      { value: 'ownership_travel', label: 'Travel for personal, family, or business reasons — maybe even own or share an aircraft someday', scores: { personalOwner: 4 } },
      { value: 'unsure', label: "I'm interested, but I'm still figuring out whether flight training makes sense", scores: { researchFirst: 4 } },
    ],
  },
  {
    id: 'timeline',
    text: 'How quickly do you want to move?',
    options: [
      { value: 'flexible', label: "Flexible — I'm okay taking my time", scores: { weekendHobbyist: 2, researchFirst: 1 } },
      { value: 'steady', label: 'Steady progress over the next year', scores: { weekendHobbyist: 1, personalOwner: 2 } },
      { value: 'fast', label: "Fast — I want a structured plan and momentum", scores: { careerCaptain: 3 } },
      { value: 'unclear', label: "I'm not ready to choose a timeline yet", scores: { researchFirst: 3 } },
    ],
  },
  {
    id: 'availability',
    text: 'How often could you realistically train?',
    options: [
      { value: 'once_weekly', label: '1 time per week', scores: { weekendHobbyist: 2, researchFirst: 1 } },
      { value: 'twice_weekly', label: '2 times per week', scores: { weekendHobbyist: 2, personalOwner: 1 } },
      { value: 'three_plus', label: '3+ times per week', scores: { careerCaptain: 3, personalOwner: 1 } },
      { value: 'unknown', label: "I'm not sure yet", scores: { researchFirst: 2 } },
    ],
  },
  {
    id: 'budget',
    text: 'Which budget statement feels most accurate?',
    options: [
      { value: 'pay_as_you_go', label: 'I want to pay as I go and stay flexible', scores: { weekendHobbyist: 3 } },
      { value: 'career_budget', label: "I'm willing to build a serious financing/budget plan if the career path makes sense", scores: { careerCaptain: 3 } },
      { value: 'ownership_budget', label: 'I can invest in training if it supports travel, safety, or future ownership', scores: { personalOwner: 3 } },
      { value: 'cost_concern', label: 'Cost is my biggest concern and I need more clarity first', scores: { researchFirst: 4 } },
    ],
  },
  {
    id: 'medical',
    text: 'How clear are you on aviation medical requirements?',
    options: [
      { value: 'probably_ok', label: "I think I'm fine, but I still need to verify", scores: { weekendHobbyist: 1, personalOwner: 1 } },
      { value: 'medical_first', label: 'I need a medical-first plan before spending money', scores: { careerCaptain: 2, researchFirst: 3 } },
      { value: 'career_medical', label: 'I already know medical eligibility is important for my career goal', scores: { careerCaptain: 3 } },
      { value: 'concerned', label: "I'm confused or concerned about medical requirements", scores: { researchFirst: 4 } },
    ],
  },
  {
    id: 'training_style',
    text: 'Which training environment sounds best?',
    options: [
      { value: 'local_flexible', label: 'Local instructor or flying club with flexibility', scores: { weekendHobbyist: 3 } },
      { value: 'structured', label: 'Structured academy or school with a defined syllabus', scores: { careerCaptain: 3 } },
      { value: 'practical_travel', label: 'Practical training focused on real-world cross-country confidence', scores: { personalOwner: 3 } },
      { value: 'compare_first', label: 'I want to compare options before deciding', scores: { researchFirst: 3 } },
    ],
  },
  {
    id: 'confidence',
    text: 'What is your confidence level right now?',
    options: [
      { value: 'confident', label: 'Pretty confident — I mostly need a starting plan', scores: { weekendHobbyist: 1, personalOwner: 1 } },
      { value: 'highly_motivated', label: 'Highly motivated — I want a serious path', scores: { careerCaptain: 3 } },
      { value: 'cautious', label: 'Motivated, but I want to avoid expensive mistakes', scores: { personalOwner: 1, researchFirst: 2 } },
      { value: 'uncertain', label: 'Curious, but uncertain', scores: { researchFirst: 3 } },
    ],
  },
  {
    id: 'next_step',
    text: 'What feels like your next best step?',
    options: [
      { value: 'discovery_flight', label: 'Book a discovery flight', scores: { weekendHobbyist: 2, personalOwner: 1 } },
      { value: 'compare_career', label: 'Compare schools/programs and understand the career path', scores: { careerCaptain: 3 } },
      { value: 'ownership_plan', label: 'Build a travel/ownership-oriented training plan', scores: { personalOwner: 3 } },
      { value: 'research_first', label: 'Research costs, medical, and school fit first', scores: { researchFirst: 4 } },
    ],
  },
];
