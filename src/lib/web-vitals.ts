

interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  isFinal: boolean;
  rating: 'good' | 'needsImprovement' | 'poor';
}

export const reportWebVitals = (metric: WebVitalsMetric): void => {
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
};

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

export const initWebVitals = (): void => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    measureLCP();
    measureFID();
    measureCLS();
    measureFCP();
    measureTTFB();
  }
};

interface PerformanceEntryWithValue extends PerformanceEntry {
  value?: number;
}
