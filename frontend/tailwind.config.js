/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#EBF8FF',
          100: '#BEE3F8',
          400: '#63B3ED',
          600: '#3182CE',
          700: '#2B6CB0',
        },
        green: {
          50: '#F0FFF4',
          100: '#C6F6D5',
          400: '#48BB78',
          600: '#2F855A',
          700: '#276749',
        },
        purple: {
          50: '#FAF5FF',
          100: '#E9D8FD',
          400: '#9F7AEA',
          600: '#6B46C1',
          700: '#553C9A',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

