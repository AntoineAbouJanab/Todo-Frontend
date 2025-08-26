"use client";

export default function Page() {
  return (
    <main className="p-6 space-y-4">
      <button
        onClick={() => document.documentElement.classList.toggle("dark")}
        className="px-3 py-2 rounded border"
      >
        Toggle dark
      </button>

      <div className="p-4 bg-white text-black dark:bg-black dark:text-white">
        If dark mode is working, this should flip colors.
      </div>
    </main>
  );
}
