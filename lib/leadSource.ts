"use client";

/**
 * First-touch lead source: the campaign (UTM tags), ad click ID, referrer and
 * landing page from the visitor's first visit, kept for 90 days in this
 * browser and sent with every enquiry so Aishwarya can see what brought them.
 */

const KEY = "aa-lead-source";
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;

type LeadSource = Partial<Record<(typeof PARAMS)[number] | "referrer" | "landing" | "firstSeen", string>> & {
  savedAt?: number;
};

function read(): LeadSource | null {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? "null") as LeadSource | null;
    if (stored?.savedAt && Date.now() - stored.savedAt < MAX_AGE_MS) return stored;
  } catch {
    // Storage blocked or corrupt: treat as a first visit.
  }
  return null;
}

/** Records where the visitor came from. A new campaign link replaces the stored source. */
export function captureLeadSource() {
  const params = new URLSearchParams(window.location.search);
  const tagged = PARAMS.some((p) => params.has(p));
  if (read() && !tagged) return;

  const source: LeadSource = { savedAt: Date.now() };
  for (const p of PARAMS) {
    const value = params.get(p);
    if (value) source[p] = value.slice(0, 150);
  }
  // Only an outside referrer is useful; moving between pages of this site is not a source.
  if (document.referrer) {
    try {
      const ref = new URL(document.referrer);
      if (ref.host !== window.location.host) source.referrer = ref.host;
    } catch {
      // Ignore unparsable referrers.
    }
  }
  source.landing = window.location.pathname;
  source.firstSeen = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  try {
    localStorage.setItem(KEY, JSON.stringify(source));
  } catch {
    // Storage blocked: the form falls back to the current page details.
  }
}

/** JSON for the hidden `source` field on lead forms. */
export function leadSourceValue() {
  const { savedAt: _savedAt, ...rest } = read() ?? { landing: window.location.pathname };
  return JSON.stringify(rest);
}
