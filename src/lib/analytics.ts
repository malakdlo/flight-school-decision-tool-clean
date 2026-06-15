import { utmPayload, type UtmParams } from '@/lib/utm';

export const COST_CALCULATOR_TOOL_NAME = 'flight_school_cost_calculator';

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function pushDataLayerEvent(event: string, payload: AnalyticsPayload = {}): void {
  const safePayload = removePiiKeys({
    tool_name: COST_CALCULATOR_TOOL_NAME,
    ...payload,
    ...utmPayload(),
  });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...safePayload,
  });
}

export function debounce<T extends (...args: unknown[]) => void>(callback: T, delay = 600): (...args: Parameters<T>) => void {
  let timer: number | undefined;

  return (...args: Parameters<T>) => {
    if (timer) {
      window.clearTimeout(timer);
    }

    timer = window.setTimeout(() => callback(...args), delay);
  };
}

export function withUtmPayload(payload: AnalyticsPayload = {}): AnalyticsPayload & UtmParams {
  return {
    ...payload,
    ...utmPayload(),
  };
}

function removePiiKeys(payload: AnalyticsPayload): AnalyticsPayload {
  const copy = { ...payload };
  delete copy.email;
  delete copy.first_name;
  delete copy.firstName;
  return copy;
}
