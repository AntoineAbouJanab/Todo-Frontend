'use client';
import { useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  // Don't read document/localStorage here. Pick a safe default.
  const [theme, setTheme] = useState<Theme>('light');

  // Decide & apply theme only in the browser after mount
  useEffect(() => {
    const saved = typeof window !== 'undefined'
      ? (localStorage.getItem('theme') as Theme | null)
      : null;

    const prefersDark =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initial: Theme = saved ?? (prefersDark ? 'dark' : 'light');
    setTheme(initial);

    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.toggle('dark', initial === 'dark');
      // optional but nice for built-in form controls
      root.style.colorScheme = initial;
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';

      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.classList.toggle('dark', next === 'dark');
        root.style.colorScheme = next;
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', next);
      }

      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
