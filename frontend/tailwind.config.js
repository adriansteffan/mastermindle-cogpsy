/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Atkinson Hyperlegible', 'sans-serif'],
      atkinson: ['Atkinson Hyperlegible', 'sans-serif'],
    },
    extend: {
      // other theme extensions...
    },
  },
  plugins: [],
};
