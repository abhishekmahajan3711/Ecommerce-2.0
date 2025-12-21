/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: { fontFamily: {
      poppins: ['Poppins', 'sans-serif'], // 👈 custom name for convenience
    },},
  },
  plugins: [],
}

