import type { ResultPath } from '@/types/quiz';

export const resultPaths: Record<ResultPath['id'], ResultPath> = {
  career: {
    id: 'career',
    eyebrow: 'Your Recommended Path',
    title: 'The Career Pilot Path',
    description:
      'You are oriented toward a professional aviation path. Your best next move is to validate medical eligibility, compare structured training options, and build a realistic financing plan before committing.',
    stats: [
      {
        label: 'Estimated Cost',
        value: '$75,000 - $100,000+',
        note: 'Zero to commercial/instrument path varies by school and region',
        variant: 'dark',
      },
      {
        label: 'Estimated Timeline',
        value: '12 - 24 Months',
        note: 'Based on high-frequency training',
      },
      {
        label: 'Intensity Level',
        value: 'High Demand',
        note: 'Best for career-focused students',
      },
    ],
    fitReasons: [
      'Your answers suggest a professional aviation goal, not just casual flying.',
      'Your budget and/or timeline expectations fit a structured training conversation.',
      'You should validate medical and financing factors early before going all-in.',
    ],
    firstSteps: [
      {
        title: 'Confirm medical eligibility early',
        description:
          'Before taking on major training cost, understand which medical certificate you need and whether anything requires an AME consultation.',
      },
      {
        title: 'Compare Part 61 vs Part 141 schools',
        description:
          'Interview at least two schools and compare total cost, aircraft availability, instructor availability, financing, and checkride timelines.',
      },
      {
        title: 'Build a training budget and weekly schedule',
        description:
          'Career training works best when you can fly frequently enough to avoid relearning skills between lessons.',
      },
    ],
  },
  hobbyist: {
    id: 'hobbyist',
    eyebrow: 'Your Recommended Path',
    title: 'The Weekend Hobbyist Path',
    description:
      'You are best matched with a flexible private pilot path focused on flying for fun, travel, and personal accomplishment without rushing into a career track.',
    stats: [
      {
        label: 'Estimated Cost',
        value: '$12,000 - $20,000+',
        note: 'Typical PPL range varies by region and training frequency',
        variant: 'dark',
      },
      {
        label: 'Estimated Timeline',
        value: '6 - 18 Months',
        note: 'Depends heavily on how often you fly',
      },
      {
        label: 'Intensity Level',
        value: 'Flexible',
        note: 'Best for evenings/weekends',
      },
    ],
    fitReasons: [
      'Your answers suggest personal flying is the main goal.',
      'A pay-as-you-go or local Part 61 path may fit better than a full-time academy.',
      'You will benefit from a realistic schedule that avoids long gaps between lessons.',
    ],
    firstSteps: [
      {
        title: 'Book a discovery flight',
        description:
          'Spend a small amount first to see if you enjoy being at the controls of a small aircraft.',
      },
      {
        title: 'Ask local schools about realistic PPL cost',
        description:
          'Do not only ask for the legal minimum. Ask about average completion hours, aircraft rates, instructor rates, and checkride fees.',
      },
      {
        title: 'Choose a consistent training cadence',
        description:
          'Two to three lessons per week is often more efficient than occasionally flying once every few weeks.',
      },
    ],
  },
  owner: {
    id: 'owner',
    eyebrow: 'Your Recommended Path',
    title: 'The Personal Aircraft / Business Travel Path',
    description:
      'You are likely interested in aviation as a practical travel or ownership tool. Your path should emphasize private pilot training, instrument proficiency, and long-term aircraft operating costs.',
    stats: [
      {
        label: 'Estimated Cost',
        value: '$25,000 - $60,000+',
        note: 'PPL plus instrument training before ownership planning',
        variant: 'dark',
      },
      {
        label: 'Estimated Timeline',
        value: '12 - 30 Months',
        note: 'Depends on PPL + instrument goals',
      },
      {
        label: 'Intensity Level',
        value: 'Strategic',
        note: 'Best for serious personal utility',
      },
    ],
    fitReasons: [
      'Your answers suggest aviation is tied to travel, business, or ownership utility.',
      'Instrument training may matter more for your long-term mission than speed alone.',
      'You should understand ownership, partnership, rental, and club options early.',
    ],
    firstSteps: [
      {
        title: 'Define your real travel mission',
        description:
          'List the trips you actually want to make, passenger needs, weather expectations, and distance ranges.',
      },
      {
        title: 'Start with PPL, then plan for instrument',
        description:
          'Private pilot training gets you started, but practical travel often requires strong weather decision-making and instrument skills.',
      },
      {
        title: 'Compare rental, club, partnership, and ownership',
        description:
          'Aircraft ownership is not just purchase price. Model insurance, hangar, maintenance, fuel, upgrades, and reserves.',
      },
    ],
  },
  explorer: {
    id: 'explorer',
    eyebrow: 'Your Recommended Path',
    title: 'The Exploration Path',
    description:
      'You are still in research mode, which is a smart place to be. Your best next step is to learn the basics, validate eligibility, and take a low-risk discovery flight before choosing a training path.',
    stats: [
      {
        label: 'Estimated Cost',
        value: '$150 - $500',
        note: 'Start with discovery flight and basic research before committing',
        variant: 'dark',
      },
      {
        label: 'Estimated Timeline',
        value: '2 - 8 Weeks',
        note: 'Time to validate interest and next steps',
      },
      {
        label: 'Intensity Level',
        value: 'Low Risk',
        note: 'Best for early exploration',
      },
    ],
    fitReasons: [
      'Your answers suggest you need more clarity before choosing a specific path.',
      'A low-risk discovery phase can prevent expensive mistakes.',
      'Medical, cost, or time questions should be clarified before committing to training.',
    ],
    firstSteps: [
      {
        title: 'Read the beginner cost guide',
        description:
          'Understand the difference between advertised minimums and realistic all-in training cost.',
        linkLabel: 'Read the guide',
        href: '/guides/flight-school-cost/',
      },
      {
        title: 'Take a discovery flight',
        description:
          'This gives you a real sensory experience of small-aircraft flying without committing to flight school.',
      },
      {
        title: 'Write down your constraints',
        description:
          'Clarify your budget, weekly availability, medical questions, and whether aviation is for fun, travel, or career change.',
      },
    ],
  },
};
