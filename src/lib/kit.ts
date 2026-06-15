import { getSegmentTagEnvName, type SegmentSlug } from '@/lib/segments';

declare const process:
  | {
      env: Record<string, string | undefined>;
    }
  | undefined;

const KIT_API_BASE = 'https://api.kit.com/v4';

let runtimeEnv: Record<string, string | undefined> | undefined;

export interface CreateOrUpdateKitSubscriberInput {
  email: string;
  firstName?: string;
  quizSegment: SegmentSlug;
  sourcePage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface CreateOrUpdateCostCalculatorSubscriberInput {
  email: string;
  firstName?: string;
  sourcePage?: string;
  leadMagnet?: string;
  trainingGoal?: string;
  trainingStructure?: string;
  lowEstimate?: string;
  baseEstimate?: string;
  highEstimate?: string;
  monthlyBudget?: string;
  lessonsPerWeek?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

export interface KitSubscriberResult {
  id: string;
  emailAddress?: string;
}

export function setKitRuntimeEnv(env: Record<string, string | undefined> | undefined): void {
  runtimeEnv = env;
}

function getEnv(name: string): string | undefined {
  return runtimeEnv?.[name] ?? process?.env?.[name] ?? import.meta.env[name];
}

function requireKitApiKey(): string {
  const apiKey = getEnv('KIT_API_KEY');
  if (!apiKey) {
    throw new Error('Kit API key is not configured.');
  }
  return apiKey;
}

function fieldKey(envName: string, fallback: string): string {
  return getEnv(envName) || fallback;
}

function optionalString(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

async function kitFetch(path: string, init: RequestInit = {}): Promise<unknown> {
  const response = await fetch(`${KIT_API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': requireKitApiKey(),
      ...init.headers,
    },
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Kit API request failed: ${response.status}`);
  }

  return body;
}

function subscriberFromResponse(body: unknown): KitSubscriberResult {
  const subscriber = (body as { subscriber?: { id?: string | number; email_address?: string } }).subscriber;
  const id = subscriber?.id;

  if (id === undefined || id === null || id === '') {
    throw new Error('Kit subscriber response did not include a subscriber id.');
  }

  return {
    id: String(id),
    emailAddress: subscriber?.email_address,
  };
}

export async function createOrUpdateKitSubscriber(
  input: CreateOrUpdateKitSubscriberInput,
): Promise<KitSubscriberResult> {
  const fields: Record<string, string> = {
    [fieldKey('KIT_FIELD_QUIZ_SEGMENT', 'quiz_segment')]: input.quizSegment,
  };

  const dynamicFields = [
    [fieldKey('KIT_FIELD_SOURCE_PAGE', 'source_page'), input.sourcePage],
    [fieldKey('KIT_FIELD_UTM_SOURCE', 'utm_source'), input.utmSource],
    [fieldKey('KIT_FIELD_UTM_MEDIUM', 'utm_medium'), input.utmMedium],
    [fieldKey('KIT_FIELD_UTM_CAMPAIGN', 'utm_campaign'), input.utmCampaign],
  ] as const;

  for (const [key, value] of dynamicFields) {
    const normalized = optionalString(value);
    if (normalized) {
      fields[key] = normalized;
    }
  }

  const payload: Record<string, unknown> = {
    email_address: input.email,
    fields,
  };

  const firstName = optionalString(input.firstName);
  if (firstName) {
    payload.first_name = firstName;
  }

  const body = await kitFetch('/subscribers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return subscriberFromResponse(body);
}

export async function createOrUpdateCostCalculatorSubscriber(
  input: CreateOrUpdateCostCalculatorSubscriberInput,
): Promise<KitSubscriberResult> {
  const fields: Record<string, string> = {};

  const dynamicFields = [
    [fieldKey('KIT_FIELD_SOURCE_PAGE', 'source_page'), input.sourcePage],
    [fieldKey('KIT_FIELD_LEAD_MAGNET', 'lead_magnet'), input.leadMagnet],
    [fieldKey('KIT_FIELD_TRAINING_GOAL', 'training_goal'), input.trainingGoal],
    [fieldKey('KIT_FIELD_TRAINING_STRUCTURE', 'training_structure'), input.trainingStructure],
    [fieldKey('KIT_FIELD_LOW_ESTIMATE', 'low_estimate'), input.lowEstimate],
    [fieldKey('KIT_FIELD_BASE_ESTIMATE', 'base_estimate'), input.baseEstimate],
    [fieldKey('KIT_FIELD_HIGH_ESTIMATE', 'high_estimate'), input.highEstimate],
    [fieldKey('KIT_FIELD_MONTHLY_BUDGET', 'monthly_budget'), input.monthlyBudget],
    [fieldKey('KIT_FIELD_LESSONS_PER_WEEK', 'lessons_per_week'), input.lessonsPerWeek],
    [fieldKey('KIT_FIELD_UTM_SOURCE', 'utm_source'), input.utmSource],
    [fieldKey('KIT_FIELD_UTM_MEDIUM', 'utm_medium'), input.utmMedium],
    [fieldKey('KIT_FIELD_UTM_CAMPAIGN', 'utm_campaign'), input.utmCampaign],
    [fieldKey('KIT_FIELD_UTM_CONTENT', 'utm_content'), input.utmContent],
    [fieldKey('KIT_FIELD_UTM_TERM', 'utm_term'), input.utmTerm],
  ] as const;

  for (const [key, value] of dynamicFields) {
    const normalized = optionalString(value);
    if (normalized) {
      fields[key] = normalized;
    }
  }

  const payload: Record<string, unknown> = {
    email_address: input.email,
    fields,
  };

  const firstName = optionalString(input.firstName);
  if (firstName) {
    payload.first_name = firstName;
  }

  let body: unknown;
  try {
    body = await kitFetch('/subscribers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (import.meta.env.DEV && Object.keys(fields).length > 0) {
      console.warn('Kit custom field submission failed; retrying cost calculator subscriber without custom fields.', error);
    }

    const fallbackPayload = { ...payload };
    delete fallbackPayload.fields;

    body = await kitFetch('/subscribers', {
      method: 'POST',
      body: JSON.stringify(fallbackPayload),
    });
  }

  return subscriberFromResponse(body);
}

export async function addSubscriberToKitForm(subscriberId: string, referrer?: string): Promise<void> {
  const formId = getEnv('KIT_FORM_ID');
  if (!formId) {
    return;
  }

  try {
    await kitFetch(`/forms/${encodeURIComponent(formId)}/subscribers/${encodeURIComponent(subscriberId)}`, {
      method: 'POST',
      body: JSON.stringify(optionalString(referrer) ? { referrer } : {}),
    });
  } catch (error) {
    console.warn('Kit form subscription failed; continuing lead capture.', error);
  }
}

export async function addSubscriberToCostCalculatorKitForm(subscriberId: string, referrer?: string): Promise<void> {
  const formId = getEnv('KIT_FORM_ID_COST_CALCULATOR') || getEnv('KIT_FORM_ID');
  if (!formId) {
    console.warn('Skipping Kit form subscription because no cost calculator form id is configured.');
    return;
  }

  try {
    await kitFetch(`/forms/${encodeURIComponent(formId)}/subscribers/${encodeURIComponent(subscriberId)}`, {
      method: 'POST',
      body: JSON.stringify(optionalString(referrer) ? { referrer } : {}),
    });
  } catch (error) {
    console.warn('Kit cost calculator form subscription failed; continuing lead capture.', error);
  }
}

export async function tagKitSubscriber(subscriberId: string, tagId: string | undefined): Promise<void> {
  if (!tagId) {
    console.warn('Skipping Kit tag because tag id is not configured.');
    return;
  }

  await kitFetch(`/tags/${encodeURIComponent(tagId)}/subscribers/${encodeURIComponent(subscriberId)}`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function applyQuizLeadTags({
  subscriberId,
  segment,
}: {
  subscriberId: string;
  segment: SegmentSlug;
}): Promise<void> {
  const tagEnvNames = [
    'KIT_TAG_LEAD_QUIZ_COMPLETED',
    'KIT_TAG_SOURCE_FSF_SITE',
    'KIT_TAG_SOURCE_QUIZ_RESULT_PAGE',
    getSegmentTagEnvName(segment),
  ];

  for (const envName of tagEnvNames) {
    await tagKitSubscriber(subscriberId, getEnv(envName));
  }
}

export async function applyCostCalculatorLeadTags(subscriberId: string): Promise<void> {
  const tagEnvNames = [
    'KIT_TAG_ID_COST_CALCULATOR',
    'KIT_TAG_ID_FLIGHT_SCHOOL_DECISION_TOOL',
    'KIT_TAG_SOURCE_FSF_SITE',
  ];

  for (const envName of tagEnvNames) {
    await tagKitSubscriber(subscriberId, getEnv(envName));
  }
}
