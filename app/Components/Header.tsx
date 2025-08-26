'use client';

import { useTheme } from "../hooks/useTheme";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full h-16 sm:h-20 flex justify-between items-center px-3 sm:px-4 py-4 border-b
                       bg-gray-300 text-gray-900 border-gray-200
                       dark:bg-dark-grey dark:text-white dark:border-neutral-700">
      {/* Left Side */}
      <div>
        <h1 className="text-sm sm:text-lg font-bold">TO DO APP</h1>
        <p className="text-xxs sm:text-xs text-gray-900 dark:text-gray-200 ">
          Stop Procrastinating , Start Organizing
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          aria-pressed={theme === "dark"}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center
                     border-gray-200 dark:border-gray-700 transition-colors bg-gray-100 dark:bg-gray-700"
        >
          {/* simple emoji icons; swap to lucide if you like */}
          <span className="text-base sm:text-lg">{theme === "dark" ? "🌙" : "☀️"}</span>
        </button>

        {/* User Icon */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-sm">👤</span>
        </div>
      </div>
      
    </header>
  );
}
