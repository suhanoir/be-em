/**
 * Lightweight, privacy-friendly event analytics for BEEM (Beauty Empire).
 * Only activates when NEXT_PUBLIC_ENABLE_ANALYTICS="true" and the user has granted consent.
 * Does not use third-party cookies or store personally identifiable information (PII).
 */

export type AnalyticsEvent =
  | "page_view"
  | "cta_click"
  | "scroll_depth"
  | "pwa_install_click"
  | "promo_code_copy"
  | "category_select"
  | "bridal_inquiry"
  | "tryon_interact";

const CONSENT_KEY = "beem_analytics_consent";

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) === "granted";
}

export function setAnalyticsConsent(granted: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
}

export function isAnalyticsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";
}

export function trackEvent(
  event: AnalyticsEvent,
  properties: Record<string, any> = {}
): void {
  if (typeof window === "undefined") return;

  // Respect consent and configuration
  if (!isAnalyticsEnabled() || !hasAnalyticsConsent()) {
    return;
  }

  const payload = {
    event,
    properties: {
      ...properties,
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    },
  };

  // In production, send beacon or log to console in dev
  if (process.env.NODE_ENV === "development") {
    console.log("[BEEM Analytics Event]", payload);
  }

  // Can be plugged into any lightweight server-side ingest endpoint:
  if (navigator.sendBeacon) {
    try {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/analytics", blob);
    } catch {
      // Gracefully ignore beacon errors
    }
  }
}

/**
 * Initializes automatic scroll-depth milestone tracking (25%, 50%, 75%, 100%)
 */
export function initScrollDepthTracking(): () => void {
  if (typeof window === "undefined" || !isAnalyticsEnabled() || !hasAnalyticsConsent()) {
    return () => {};
  }

  const milestonesReached = new Set<number>();
  const milestones = [25, 50, 75, 100];

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const currentPercentage = Math.round((window.scrollY / scrollHeight) * 100);

    for (const m of milestones) {
      if (currentPercentage >= m && !milestonesReached.has(m)) {
        milestonesReached.add(m);
        trackEvent("scroll_depth", { depth: `${m}%` });
      }
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}
