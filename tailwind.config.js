/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C81E1E', // Red for emergency/ambulance
        secondary: '#046C4E', // Green for medical/health
        dark: '#111827', // Dark background
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'serif'],
        heading: ['Copperplate', 'serif'],
        copperplate: ['Copperplate', 'serif'],
      }
    },
  },
  plugins: [],
}
