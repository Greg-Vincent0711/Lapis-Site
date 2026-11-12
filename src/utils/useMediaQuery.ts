import { useCallback, useSyncExternalStore } from "react";

/** Breakpoint (px) at or below which the phone layout is used. Keep in sync with CSS. */
export const MOBILE_QUERY = "(max-width: 768px)";

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 */
export default function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
