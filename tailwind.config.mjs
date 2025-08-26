
// client/tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: {colors: {
        "dark-grey": "hsl(220, 11%, 15%)",
        "light-grey": "hsl(218, 11%, 20%)",
      },} },
  plugins: [],
};

