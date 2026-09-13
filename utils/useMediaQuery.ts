import { useEffect, useState } from 'react';

/** The breakpoint the stylesheet uses to switch to the single-column layout. */
export const MOBILE_LAYOUT_QUERY = '(max-width: 800px)';

/**
 * Server rendering has no viewport, so this starts as `false` and settles on
 * mount. Keep purely visual decisions in CSS media queries; reach for this
 * only where the markup itself has to differ between breakpoints.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Not every environment implements matchMedia (jsdom does not). Staying at
    // the server-rendered value is the right fallback there.
    if (typeof window.matchMedia !== 'function') return;

    const media = window.matchMedia(query);
    const update = (): void => setMatches(media.matches);

    update();
    media.addEventListener('change', update);
    return (): void => media.removeEventListener('change', update);
  }, [query]);

  return matches;
};
