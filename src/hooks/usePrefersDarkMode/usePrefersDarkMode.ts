import { useEffect, useState } from 'react';

const QUERY = '(prefers-color-scheme: dark)';

/**
 * Tracks the OS-level `prefers-color-scheme` setting, mirroring the
 * `dark:` Tailwind variant used elsewhere in the app so that JS-driven
 * styling (e.g. syntax highlighter themes) can stay in sync.
 */
export function usePrefersDarkMode(): boolean {
  const [prefersDark, setPrefersDark] = useState(
    () => window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersDark(event.matches);
    };

    mediaQueryList.addEventListener('change', handleChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersDark;
}
