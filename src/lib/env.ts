/**
 * Client capability detection — the backbone of INVARIANT-03.
 * Every WebGL/GSAP enhancement gates on these so the static, reduced-motion,
 * and no-WebGL paths always render finished content.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let _webgl: boolean | null = null;
export function supportsWebGL(): boolean {
  if (_webgl !== null) return _webgl;
  if (typeof window === 'undefined') return (_webgl = false);
  try {
    const c = document.createElement('canvas');
    const gl =
      c.getContext('webgl2') ||
      c.getContext('webgl') ||
      c.getContext('experimental-webgl');
    _webgl = !!gl;
  } catch {
    _webgl = false;
  }
  return _webgl;
}

/** True only when the enhanced motion path should run at all. */
export function motionAllowed(): boolean {
  return !prefersReducedMotion();
}

/** Coarse "low-power / small screen" hint — used to shrink particle/node counts. */
export function isCompact(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 720px)').matches;
}

/** Respect the data-saver signal where browsers expose it. */
export function saveData(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return !!nav.connection?.saveData;
}

/**
 * Run `cb` once the element scrolls near the viewport, then disconnect.
 * Falls back to running immediately if IntersectionObserver is unavailable.
 */
export function onNearViewport(
  el: Element,
  cb: () => void,
  rootMargin = '200px'
): void {
  if (typeof IntersectionObserver === 'undefined') {
    cb();
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          io.disconnect();
          cb();
          return;
        }
      }
    },
    { rootMargin }
  );
  io.observe(el);
}
