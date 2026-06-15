import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import {
  addSubscriberToCostCalculatorKitForm,
  applyCostCalculatorLeadTags,
  createOrUpdateCostCalculatorSubscriber,
  setKitRuntimeEnv,
} from '@/lib/kit';
import {
  COST_CALCULATOR_LEAD_MAGNET,
  COST_CALCULATOR_SOURCE_PAGE,
} from '@/lib/flightSchoolCostCalculator';

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
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }

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
  const firstName = normalizeOptionalString(data.first_name);

  if (!email || !emailPattern.test(email)) {
    return jsonResponse({ ok: false, error: 'Enter a valid email address.' }, 400);
  }

  try {
    const subscriber = await createOrUpdateCostCalculatorSubscriber({
      email,
      firstName,
      sourcePage: normalizeOptionalString(data.source_page) || COST_CALCULATOR_SOURCE_PAGE,
      leadMagnet: normalizeOptionalString(data.lead_magnet) || COST_CALCULATOR_LEAD_MAGNET,
      trainingGoal: normalizeOptionalString(data.training_goal),
      trainingStructure: normalizeOptionalString(data.training_structure),
      lowEstimate: normalizeOptionalString(data.low_estimate),
      baseEstimate: normalizeOptionalString(data.base_estimate),
      highEstimate: normalizeOptionalString(data.high_estimate),
      monthlyBudget: normalizeOptionalString(data.monthly_budget),
      lessonsPerWeek: normalizeOptionalString(data.lessons_per_week),
      utmSource: normalizeOptionalString(data.utm_source),
      utmMedium: normalizeOptionalString(data.utm_medium),
      utmCampaign: normalizeOptionalString(data.utm_campaign),
      utmContent: normalizeOptionalString(data.utm_content),
      utmTerm: normalizeOptionalString(data.utm_term),
    });

    await addSubscriberToCostCalculatorKitForm(subscriber.id, COST_CALCULATOR_SOURCE_PAGE);
    await applyCostCalculatorLeadTags(subscriber.id);

    return jsonResponse({ ok: true }, 200);
  } catch (error) {
    console.error('Kit cost calculator capture failed.', error);
    const message = error instanceof Error && error.message.includes('API key')
      ? 'Kit is not configured locally. Add KIT_API_KEY and a Kit form id to .env.local to test email delivery.'
      : 'Email capture failed.';

    return jsonResponse({ ok: false, error: message }, 500);
  }
};
