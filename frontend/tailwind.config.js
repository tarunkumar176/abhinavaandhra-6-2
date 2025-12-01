/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./types.ts"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        telugu: {
          primary: '#1e40af', // blue-800
          secondary: '#1e3a8a', // blue-900
          accent: '#60a5fa', // blue-400
        }
      },
      fontFamily: {
        telugu: ['Noto Sans Telugu', 'sans-serif'],
      }
    },
  },
  plugins: [],
}