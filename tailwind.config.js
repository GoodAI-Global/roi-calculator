/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        goodai: {
          teal: '#4ECDC4',
          blue: '#4A90E2',
          black: '#000000',
        },
      },
    },
  },
  plugins: [],
};
