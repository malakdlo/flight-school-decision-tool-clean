export type SegmentSlug =
  | 'career_captain'
  | 'weekend_hobbyist'
  | 'personal_owner'
  | 'research_first';

export const SEGMENTS = {
  career_captain: {
    displayName: 'Career Captain',
    tagEnv: 'KIT_TAG_SEGMENT_CAREER_CAPTAIN',
    resultPath: '/flight-school-decision-tool/results/career-captain/',
  },
  weekend_hobbyist: {
    displayName: 'Weekend Hobbyist',
    tagEnv: 'KIT_TAG_SEGMENT_WEEKEND_HOBBYIST',
    resultPath: '/flight-school-decision-tool/results/weekend-hobbyist/',
  },
  personal_owner: {
    displayName: 'Personal Owner',
    tagEnv: 'KIT_TAG_SEGMENT_PERSONAL_OWNER',
    resultPath: '/flight-school-decision-tool/results/personal-owner/',
  },
  research_first: {
    displayName: 'Research First',
    tagEnv: 'KIT_TAG_SEGMENT_RESEARCH_FIRST',
    resultPath: '/flight-school-decision-tool/results/research-first/',
  },
} as const satisfies Record<
  string,
  {
    displayName: string;
    tagEnv: string;
    resultPath: string;
  }
>;

export function isSegmentSlug(value: unknown): value is SegmentSlug {
  return typeof value === 'string' && value in SEGMENTS;
}

export function getSegmentTagEnvName(segment: SegmentSlug): string {
  return SEGMENTS[segment].tagEnv;
}

export function getSegmentResultPath(segment: SegmentSlug): string {
  return SEGMENTS[segment].resultPath;
}
