/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        honey: {
          50: '#FFF9E6',
          100: '#FFF0CC',
          200: '#FFE199',
          300: '#FFD266',
          400: '#FFC333',
          500: '#FFB400',
          600: '#CC9000',
          700: '#996C00',
          800: '#664800',
          900: '#332400',
        },
        tomato: {
          50: '#FFF5F0',
          100: '#FFE6DC',
          200: '#FFCDB8',
          300: '#FFB495',
          400: '#FF9B71',
          500: '#FF6B35',
          600: '#E55A2B',
          700: '#CC4A22',
          800: '#993818',
          900: '#66250F',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}