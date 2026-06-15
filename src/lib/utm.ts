export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmParams = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = 'fsf_utm_params';

function storage(): Storage | undefined {
  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
}

export function readStoredUtmParams(): UtmParams {
  const store = storage();
  if (!store) {
    return {};
  }

  try {
    const parsed = JSON.parse(store.getItem(STORAGE_KEY) || '{}') as UtmParams;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function captureUtmParams(search = window.location.search): UtmParams {
  const params = new URLSearchParams(search);
  const current: UtmParams = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      current[key] = value;
    }
  }

  if (Object.keys(current).length === 0) {
    return readStoredUtmParams();
  }

  const merged = {
    ...readStoredUtmParams(),
    ...current,
  };

  try {
    storage()?.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Storage is optional; analytics and lead capture still work without it.
  }

  return merged;
}

export function utmPayload(): UtmParams {
  return captureUtmParams();
}
