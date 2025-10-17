/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0F2A75',
        'brand-light': '#098DCF',
        'brand-white': '#FFFFFF',
      },
      fontFamily: {
        'brand': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
