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
