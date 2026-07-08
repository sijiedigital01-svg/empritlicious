/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F3',
        'cream-dark': '#F0E8D8',
        brown: {
          900: '#2C1F0E',
          800: '#3D1F0A',
          700: '#5A3F25',
          500: '#7A5C3A',
          300: '#9A7A55',
        },
        amber: {
          DEFAULT: '#C4853A',
          light: '#EDD9B0',
        },
        gold: '#FAC775',
        card: '#FFFDF8',
        border: '#E5DDD0',
        danger: '#8B2020',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
