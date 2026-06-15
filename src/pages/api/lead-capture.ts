import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import {
  addSubscriberToKitForm,
  applyQuizLeadTags,
  createOrUpdateKitSubscriber,
  setKitRuntimeEnv,
} from '@/lib/kit';
import { isSegmentSlug } from '@/lib/segments';

export const prerender = false;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
}

export const POST: APIRoute = async ({ request }) => {
  setKitRuntimeEnv(env as Record<string, string | undefined>);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON payload.' }, 400);
  }

  const data = payload as Record<string, unknown>;
  const email = normalizeOptionalString(data.email)?.toLowerCase();
  const firstName = normalizeOptionalString(data.firstName);
  const quizSegment = data.quizSegment;
  const sourcePage = normalizeOptionalString(data.sourcePage);
  const utmSource = normalizeOptionalString(data.utmSource);
  const utmMedium = normalizeOptionalString(data.utmMedium);
  const utmCampaign = normalizeOptionalString(data.utmCampaign);

  if (!email || !emailPattern.test(email)) {
    return jsonResponse({ ok: false, error: 'Enter a valid email address.' }, 400);
  }

  if (!isSegmentSlug(quizSegment)) {
    return jsonResponse({ ok: false, error: 'Unsupported quiz segment.' }, 400);
  }

  try {
    const subscriber = await createOrUpdateKitSubscriber({
      email,
      firstName,
      quizSegment,
      sourcePage,
      utmSource,
      utmMedium,
      utmCampaign,
    });

    await addSubscriberToKitForm(subscriber.id, sourcePage);
    await applyQuizLeadTags({ subscriberId: subscriber.id, segment: quizSegment });

    return jsonResponse({ ok: true }, 200);
  } catch (error) {
    console.error('Kit lead capture failed.', error);
    return jsonResponse({ ok: false, error: 'Lead capture failed.' }, 500);
  }
};
