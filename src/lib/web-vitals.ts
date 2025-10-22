/**
 * Web Vitals Monitoring
 *
 * This module provides utilities to measure and report Core Web Vitals metrics:
 * - Largest Contentful Paint (LCP)
 * - First Input Delay (FID)
 * - Cumulative Layout Shift (CLS)
 * - First Contentful Paint (FCP)
 * - Time to First Byte (TTFB)
 */

/**
 * Web Vitals metric interface
 */
interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  isFinal: boolean;
  rating: 'good' | 'needsImprovement' | 'poor';
}

/**
 * Report a Web Vitals metric
 * Can be extended to send metrics to an analytics service
 */
export const reportWebVitals = (metric: WebVitalsMetric): void => {
  // Send to analytics service (e.g., Google Analytics, Sentry)
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as Record<string, unknown>).gtag as (
      action: string,
      eventName: string,
      eventData: Record<string, unknown>
    ) => void;
    gtag('event', 'web_vitals', {
      event_category: 'web_vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      event_action: metric.name,
      non_interaction: true,
    });
  }

  // Send to custom API endpoint
  if (import.meta.env.PROD) {
    // Optional: Send metrics to your backend
    // fetch('/api/metrics', { method: 'POST', body: JSON.stringify(metric) });
  }
};

/**
 * Measure Largest Contentful Paint (LCP)
 * Measures when the largest element becomes visible
 * Goal: < 2.5 seconds
 */
export const measureLCP = (): void => {
  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntryWithValue;

      reportWebVitals({
        name: 'LCP',
        value: lastEntry.startTime,
        id: `lcp-${Date.now()}`,
        isFinal: false,
        rating: lastEntry.startTime < 2500 ? 'good' : 'poor',
      });
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch {
    // PerformanceObserver not supported
  }
};

/**
 * Measure First Input Delay (FID)
 * Measures the time from user input to response
 * Goal: < 100 milliseconds
 */
export const measureFID = (): void => {
  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: PerformanceEntry) => {
        const fidEntry = entry as unknown as { processingDuration: number };
        reportWebVitals({
          name: 'FID',
          value: fidEntry.processingDuration,
          id: `fid-${Date.now()}`,
          isFinal: true,
          rating: fidEntry.processingDuration < 100 ? 'good' : 'poor',
        });
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
  } catch {
    // PerformanceObserver not supported
  }
};

/**
 * Measure Cumulative Layout Shift (CLS)
 * Measures unexpected layout shifts
 * Goal: < 0.1
 */
export const measureCLS = (): void => {
  try {
    let clsValue = 0;

    const observer = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry: PerformanceEntry) => {
        const clsEntry = entry as unknown as { value: number; hadRecentInput: boolean };
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value;

          reportWebVitals({
            name: 'CLS',
            value: clsValue,
            id: `cls-${Date.now()}`,
            isFinal: false,
            rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needsImprovement' : 'poor',
          });
        }
      });
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  } catch {
    // PerformanceObserver not supported
  }
};

/**
 * Measure First Contentful Paint (FCP)
 * Measures when first text or image is painted
 * Goal: < 1.8 seconds
 */
export const measureFCP = (): void => {
  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: PerformanceEntry) => {
        const fcpEntry = entry as unknown as { startTime: number };
        reportWebVitals({
          name: 'FCP',
          value: fcpEntry.startTime,
          id: `fcp-${Date.now()}`,
          isFinal: true,
          rating: fcpEntry.startTime < 1800 ? 'good' : 'poor',
        });
      });
    });

    observer.observe({ entryTypes: ['paint'] });
  } catch {
    // PerformanceObserver not supported
  }
};

/**
 * Measure Time to First Byte (TTFB)
 * Measures server response time
 * Goal: < 600 milliseconds
 */
export const measureTTFB = (): void => {
  try {
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (navigationTiming) {
      const ttfb = navigationTiming.responseStart - navigationTiming.requestStart;

      reportWebVitals({
        name: 'TTFB',
        value: ttfb,
        id: `ttfb-${Date.now()}`,
        isFinal: true,
        rating: ttfb < 600 ? 'good' : 'poor',
      });
    }
  } catch {
    // Navigation timing not supported
  }
};

/**
 * Initialize all Web Vitals measurements
 * Call this once on app initialization
 */
export const initWebVitals = (): void => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    measureLCP();
    measureFID();
    measureCLS();
    measureFCP();
    measureTTFB();
  }
};

/**
 * Type declaration for PerformanceEntry with value
 */
interface PerformanceEntryWithValue extends PerformanceEntry {
  value?: number;
}
