/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './public/index.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          normal: colors.emerald,
        },
        text: {
          light: '#333333',
          dark: '#FFFFFF',
        },

      },
    },
  },
  plugins: [],
}


