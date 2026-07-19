const KEY = "tamuku_onboarding_draft";

export interface OnboardingDraft {
  periodStartIso?: string | null;
  initialTtd?: number;
}

export function readDraft(): OnboardingDraft {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as OnboardingDraft;
  } catch {
    return {};
  }
}

export function writeDraft(patch: Partial<OnboardingDraft>) {
  if (typeof window === "undefined") return;
  const cur = readDraft();
  const next = { ...cur, ...patch };
  window.sessionStorage.setItem(KEY, JSON.stringify(next));
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(KEY);
}
