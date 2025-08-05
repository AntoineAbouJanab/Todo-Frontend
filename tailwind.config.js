/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // optional if using app directory
  ],
  darkMode: 'class', // 👈 enables manual toggle support
  theme: {
    extend: {
      colors: {
        "dark-grey": "hsl(220, 11%, 15%)",
        "light-grey": "hsl(218, 11%, 20%)",
      },
    },
  },
  plugins: [],
}
